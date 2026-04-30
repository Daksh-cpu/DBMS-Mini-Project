-- 01_schema.sql
-- Real Estate Management Database Schema (MySQL 8+)

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS property_types;
DROP TABLE IF EXISTS locations;
SET FOREIGN_KEY_CHECKS = 1;

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
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS owners (
  owner_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(120) NOT NULL,
  owner_type ENUM('individual', 'builder', 'company') NOT NULL DEFAULT 'individual',
  contact_email VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  city VARCHAR(100),
  joined_date DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agents (
  agent_id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(120) NOT NULL,
  agency_name VARCHAR(150),
  contact_email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  license_no VARCHAR(50) NOT NULL UNIQUE,
  joined_date DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS properties (
  property_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  location_id INT NOT NULL,
  type_id INT NOT NULL,
  agent_id INT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2) NOT NULL,
  area_sqft INT,
  listing_type ENUM('sale', 'rent', 'lease') NOT NULL,
  availability_status ENUM('available', 'booked', 'sold') NOT NULL DEFAULT 'available',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
  CONSTRAINT fk_properties_location FOREIGN KEY (location_id) REFERENCES locations(location_id),
  CONSTRAINT fk_properties_type FOREIGN KEY (type_id) REFERENCES property_types(type_id),
  CONSTRAINT fk_properties_agent FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_type ENUM('visit', 'reservation', 'sale_agreement') NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(15, 2) NOT NULL,
  CONSTRAINT fk_bookings_property FOREIGN KEY (property_id) REFERENCES properties(property_id),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_method ENUM('cash', 'card', 'bank_transfer', 'upi') NOT NULL,
  status ENUM('success', 'pending', 'failed') NOT NULL DEFAULT 'success',
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_property FOREIGN KEY (property_id) REFERENCES properties(property_id),
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Indexes for performance
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_city_type_status ON properties(location_id, type_id, availability_status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
