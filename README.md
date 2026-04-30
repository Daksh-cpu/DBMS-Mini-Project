# Real Estate Database Management System (DBMS)

A production-ready, full-stack Real Estate Management System built with **Node.js**, **Express**, and **MySQL**. This project features a normalized 3NF schema, RESTful API integration, and dynamic dashboard visualizations.

## 🌐 Live Website
**[View Live Demo Here](https://github.com/Daksh-cpu/DBMS-Mini-Project)** *(Update this link after deploying to Render/Railway)*

### 📊 Dashboard Preview
![Dashboard](preview_images/Dashboard.png)

### 📈 Analytics & Insights
![Analytics](preview_images/Analytics.png)

## 🚀 Key Features

- **Full CRUD Operations**: Manage Properties, Bookings, Users, Agents, Owners, and Locations.
- **Dynamic Analytics**: Real-time charts for Revenue by Type and Booking Distributions using Chart.js.
- **MySQL Backend**: Normalized 3NF schema with foreign key constraints and ACID transaction support.
- **Automated Seeding**: One-click "Load Sample Data" to reset and populate the database.
- **Modern UI**: Dark-themed, glassmorphic design with DM Sans typography and responsive layouts.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+), Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL (relational)
- **Dependencies**: `mysql2`, `cors`, `dotenv`, `express`

## 🏁 Quick Start

### 1. Prerequisites
- **Node.js** (LTS version recommended)
- **MySQL Server** (running locally or remotely)

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=real_estate_db
PORT=3000
```

### 3. Installation
```bash
npm install
```

### 4. Run the Server
```bash
npm start
```
The server will automatically initialize the database schema and seed data on first run.

---
**Mini Project · IT Department · DBMS Lab**
