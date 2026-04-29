require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve frontend files

// Load SQL files directory
const sqlDir = path.join(__dirname, 'sql');

// Improved MySQL Pool Configuration (without database first to ensure it can be created)
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

let pool;

async function initDB() {
    try {
        console.log('🔄 Connecting to MySQL...');
        const tempConn = await mysql.createConnection(poolConfig);
        
        const dbName = process.env.DB_NAME || 'real_estate_db';
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database "${dbName}" ensured.`);
        await tempConn.end();

        // Now create the pool with the database selected
        pool = mysql.createPool({
            ...poolConfig,
            database: dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const connection = await pool.getConnection();
        console.log('✅ MySQL Pool Connected!');

        // Check if tables exist
        const [tables] = await connection.query('SHOW TABLES');
        if (tables.length === 0) {
            console.log('⚠️ Database empty. Running schema and seed...');
            const schemaSql = await fs.readFile(path.join(sqlDir, '01_schema.sql'), 'utf8');
            const seedSql = await fs.readFile(path.join(sqlDir, '02_seed_data.sql'), 'utf8');
            
            await connection.query(schemaSql);
            await connection.query(seedSql);
            console.log('✅ Schema and Seed data loaded.');
        }

        connection.release();
        console.log('✅ Database initialization complete!');
    } catch (err) {
        console.error('❌ DB Init failed:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('👉 Tip: Check your DB_PASSWORD in the .env file!');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('👉 Tip: Make sure your MySQL server is running!');
        }
    }
}

// ---------------------------------------------------------------------
// API ENDPOINTS
// ---------------------------------------------------------------------

// Stats for Dashboard
app.get('/api/stats', async (req, res) => {
    try {
        if (!pool) throw new Error('Database not initialized');
        const [[propCount]] = await pool.query('SELECT COUNT(*) as count FROM properties');
        const [[bookCount]] = await pool.query('SELECT COUNT(*) as count FROM bookings');
        const [[userCount]] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [[revSum]] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status IN ("Confirmed", "Completed")');

        res.json({
            properties: propCount.count,
            bookings: bookCount.count,
            users: userCount.count,
            revenue: revSum.total
        });
    } catch (err) {
        console.error('API Error /stats:', err);
        res.status(500).json({ error: err.message });
    }
});

// Properties
app.get('/api/properties', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, pt.type_name, l.city, l.locality, o.owner_name, a.agent_name
            FROM properties p
            JOIN property_types pt ON p.type_id = pt.type_id
            JOIN locations l ON p.location_id = l.location_id
            JOIN owners o ON p.owner_id = o.owner_id
            LEFT JOIN agents a ON p.agent_id = a.agent_id
            ORDER BY p.property_id DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/properties', async (req, res) => {
    try {
        const p = req.body;
        const [result] = await pool.query(
            'INSERT INTO properties (type_id, owner_id, agent_id, location_id, title, price, area_sqft, bedrooms, furnishing, listing_type, availability_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [p.type_id, p.owner_id, p.agent_id, p.location_id, p.title, p.price, p.area_sqft, p.bedrooms, p.furnishing, p.listing_type, p.availability_status]
        );
        res.json({ success: true, insertId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/properties/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM properties WHERE property_id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bookings ORDER BY booking_id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const b = req.body;
        const [result] = await pool.query(
            'INSERT INTO bookings (property_id, user_id, booking_type, total_amount, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [b.property_id, b.user_id, b.booking_type, b.total_amount, b.status, b.notes]
        );
        res.json({ success: true, insertId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
    try {
        await pool.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/bookings/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM bookings WHERE booking_id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Users, Agents, Owners, Locations, Payments, Reviews
const tables = ['users', 'agents', 'owners', 'locations', 'payments', 'reviews', 'property_types'];
tables.forEach(table => {
    app.get(`/api/${table.replace('_', '-')}`, async (req, res) => {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY 1 DESC`);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
});

// Analytics
app.get('/api/analytics/revenue-type', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT pt.type_name, COUNT(b.booking_id) AS total_bookings, SUM(b.total_amount) AS total_revenue
            FROM property_types pt
            JOIN properties p ON pt.type_id = p.type_id
            JOIN bookings b ON p.property_id = b.property_id
            WHERE b.status IN ('Confirmed', 'Completed')
            GROUP BY pt.type_id
            ORDER BY total_revenue DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Database
app.post('/api/seed', async (req, res) => {
    try {
        if (!pool) throw new Error('Database not initialized');
        const schemaSql = await fs.readFile(path.join(sqlDir, '01_schema.sql'), 'utf8');
        const seedSql = await fs.readFile(path.join(sqlDir, '02_seed_data.sql'), 'utf8');
        
        const connection = await pool.getConnection();
        try {
            await connection.query('SET FOREIGN_KEY_CHECKS = 0');
            // Execute schema and seed
            await connection.query(schemaSql);
            await connection.query(seedSql);
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            res.json({ success: true, message: 'Database reset and sample data loaded!' });
        } catch (dbErr) {
            console.error('Seeding Query Error:', dbErr);
            res.status(500).json({ error: 'SQL Execution Error: ' + dbErr.message });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Seed Endpoint Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', uptime: process.uptime() }));

// Start Server
async function start() {
    await initDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

start().catch(console.error);
