# 🏢 Real Estate Database Management System (DBMS)

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://dbms-mini-project-4w7o.onrender.com/)
[![MySQL](https://img.shields.io/badge/database-MySQL-blue.svg)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/backend-Node.js-brightgreen.svg)](https://nodejs.org/)

A production-ready, full-stack **Real Estate Management System** designed for high-performance data handling and real-time analytics. This project features a robust **3NF Normalized SQL Schema**, a RESTful Node.js backend, and a modern, glassmorphic dashboard.

## 🌐 Live Website
**[👉 Click here to view the Live Demo](https://dbms-mini-project-4w7o.onrender.com/)**  
*(Hosted on Render with Aiven Cloud MySQL)*

---

## 📊 Project Previews

### 🖥️ Interactive Dashboard
![Dashboard Preview](./preview_images/dashboard.png)
*Real-time tracking of properties, bookings, revenue, and active users.*

### 📈 Analytics & Insights
![Analytics Preview](./preview_images/analytics.png)
*Dynamic charts representing booking distributions and revenue trends by location.*

---

## 🚀 Key Features

- **Full CRUD Support**: Create, Read, Update, and Delete operations for Properties, Bookings, Users, and Agents.
- **Dynamic Data Visualization**: Real-time Analytics using **Chart.js** (Doughnut & Bar charts).
- **Normalized Architecture**: 10+ interconnected tables in **3rd Normal Form (3NF)** for data integrity.
- **One-Click Seeding**: Automated "Load Sample Data" feature to instantly populate the database.
- **Modern UI**: Dark-themed, glassmorphic design with responsive CSS and premium typography (Syne & DM Sans).

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+), Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL (hosted on Aiven Cloud)
- **Deployment**: Render (Web Service)

---

## 🏗️ Database Schema (3NF)

The system is built on a relational architecture designed to eliminate redundancy:
- **`properties`**: Core table linked to Owners, Agents, and Locations.
- **`bookings`**: Tracks interactions between Users and Properties.
- **`payments`**: Specialized table for transaction history and status.
- **`reviews`**: Handles property ratings and user feedback.
- **`locations` & `property_types`**: Master tables for data standardization.

---

## 🏁 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/Daksh-cpu/DBMS-Mini-Project.git
cd DBMS-Mini-Project
```

### 2. Configure Environment
Create a `.env` file in the root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=real_estate_db
PORT=3000
```

### 3. Install & Run
```bash
npm install
npm start
```
The server will automatically initialize the schema on the first run.

---

## 📄 License
This project was developed as part of the **DBMS Mini Project (IT Department)**.

**Built with ❤️ for Modern Real Estate Management.**
