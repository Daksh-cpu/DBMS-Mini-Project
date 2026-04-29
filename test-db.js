require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('🔍 Testing MySQL Connection...');
    console.log('------------------------------');
    console.log(`Host: ${process.env.DB_HOST}`);
    const pwd = process.env.DB_PASSWORD || '';
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Password: ${pwd ? '********' : '(empty)'}`);
    console.log(`Password Length: ${pwd.length} characters`);
    if (pwd.length > 2) {
        console.log(`Password starts with: "${pwd[0]}" and ends with: "${pwd[pwd.length-1]}"`);
    }
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log('------------------------------');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        console.log('✅ Success: Connected to MySQL server!');
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'real_estate_db'}`);
        console.log(`✅ Success: Database "${process.env.DB_NAME || 'real_estate_db'}" is accessible.`);
        
        await connection.end();
        console.log('\n🚀 Everything looks good! You can now run "npm start".');
    } catch (err) {
        console.error('\n❌ Connection Failed!');
        console.error(`Error Code: ${err.code}`);
        console.error(`Error Message: ${err.message}`);
        
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n👉 Tip: Your password or username is incorrect. Please update the .env file.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('\n👉 Tip: MySQL server is not running or the port is wrong.');
        } else if (err.code === 'ENOTFOUND') {
            console.error('\n👉 Tip: The DB_HOST is invalid.');
        }
        process.exit(1);
    }
}

testConnection();
