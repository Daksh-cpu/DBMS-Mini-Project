-- 01_schema.sql
-- Real Estate Management Database Schema (MySQL 8+)

CREATE DATABASE IF NOT EXISTS real_estate_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE real_estate_db;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  role ENUM('buyer', 'tenant', 'agent', 'admin') NOT NULL DEFAULT 'buyer',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS locations (
  location_id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(80) NOT NULL,
  state VARCHAR(80) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  locality VARCHAR(120),
  country VARCHAR(80) NOT NULL DEFAULT 'India'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS property_types (
  type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL UNIQUE,
  parent_id INT,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_property_types_parent
    FOREIGN KEY (parent_id) REFERENCES property_types(type_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS owners (
  owner_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(120) NOT NULL,
  contact_email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15),
  owner_type ENUM('Individual', 'Builder') NOT NULL,
  city VARCHAR(80),
  joined_date DATE NOT NULL DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agents (
  agent_id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(120) NOT NULL,
  contact_email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15),
  agency_name VARCHAR(120),
  license_no VARCHAR(50) NOT NULL UNIQUE,
  joined_date DATE NOT NULL DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS properties (
  property_id INT AUTO_INCREMENT PRIMARY KEY,
  type_id INT NOT NULL,
  owner_id INT NOT NULL,
  agent_id INT,
  location_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  price DECIMAL(14,2) NOT NULL,
  area_sqft DECIMAL(10,2) NOT NULL,
  bedrooms TINYINT DEFAULT 0,
  furnishing ENUM('Unfurnished', 'Semi-Furnished', 'Fully Furnished') DEFAULT 'Unfurnished',
  listing_type ENUM('Sale', 'Rent', 'Lease') NOT NULL,
  availability_status ENUM('Available', 'Booked', 'Sold', 'Under Construction')
    NOT NULL DEFAULT 'Available',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_properties_price CHECK (price >= 0),
  CONSTRAINT chk_properties_area CHECK (area_sqft > 0),
  CONSTRAINT fk_properties_type
    FOREIGN KEY (type_id) REFERENCES property_types(type_id)
    ON UPDATE CASCADE,
  CONSTRAINT fk_properties_owner
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id)
    ON UPDATE CASCADE,
  CONSTRAINT fk_properties_agent
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_properties_location
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  booking_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  booking_type ENUM('Purchase', 'Rent', 'SiteVisit') NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  notes TEXT,
  CONSTRAINT chk_bookings_amount CHECK (total_amount >= 0),
  CONSTRAINT fk_bookings_property
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
    ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50),
  status ENUM('Success', 'Failed', 'Pending') NOT NULL DEFAULT 'Pending',
  CONSTRAINT chk_payments_amount CHECK (amount > 0),
  CONSTRAINT fk_payments_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  review_text TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT uq_reviews_user_property UNIQUE (user_id, property_id),
  CONSTRAINT fk_reviews_property
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_properties_city_type_status
  ON properties (location_id, type_id, availability_status);
CREATE INDEX idx_properties_price ON properties (price);
CREATE INDEX idx_reviews_property ON reviews (property_id);
CREATE INDEX idx_bookings_status ON bookings (status);
