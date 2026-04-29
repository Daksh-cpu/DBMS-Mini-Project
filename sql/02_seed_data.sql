-- 02_seed_data.sql
-- Seed data aligned with dashboard sample data

USE real_estate_db;

INSERT INTO locations (city, state, pincode, locality, country) VALUES
('Hyderabad', 'Telangana', '500034', 'Banjara Hills', 'India'),
('Mumbai', 'Maharashtra', '400005', 'Colaba', 'India'),
('Bengaluru', 'Karnataka', '560034', 'Koramangala', 'India'),
('Delhi', 'Delhi', '110001', 'Connaught Place', 'India'),
('Pune', 'Maharashtra', '411038', 'Kothrud', 'India'),
('Chennai', 'Tamil Nadu', '600028', 'Adyar', 'India');

INSERT INTO property_types (type_name, parent_id, description) VALUES
('Residential', NULL, 'All residential properties'),
('Commercial', NULL, 'Commercial properties'),
('Apartment', 1, 'Residential apartment'),
('Villa', 1, 'Independent villa'),
('Indep. House', 1, 'Independent house'),
('Office Space', 2, 'Commercial office'),
('Retail Shop', 2, 'Retail shop');

INSERT INTO owners (owner_name, contact_email, phone, owner_type, city, joined_date) VALUES
('Rajesh Kumar', 'rk@gmail.com', '9876543210', 'Individual', 'Hyderabad', '2023-01-15'),
('Lakshmi Builders', 'lb@builders.com', '9988776655', 'Builder', 'Mumbai', '2023-01-15'),
('Arjun Singh', 'as@gmail.com', '9876501234', 'Individual', 'Delhi', '2023-01-15'),
('Prestige Group', 'prestige@group.com', '8088001234', 'Builder', 'Bengaluru', '2023-01-15');

INSERT INTO agents (agent_name, contact_email, phone, agency_name, license_no, joined_date) VALUES
('Priya Mehta', 'priya@realty.com', '9871234567', 'StarRealty Pvt Ltd', 'MH/REA/2023/001', '2023-03-10'),
('Arun Patel', 'arun@props.com', '9823456789', 'PropStar India', 'TG/REA/2022/044', '2023-03-10'),
('Sunita Reddy', 'sunita@housing.com', '9945678901', 'HousingPro', 'DL/REA/2021/112', '2023-03-10');

INSERT INTO users (username, email, password_hash, phone, role, created_at) VALUES
('rahul_sharma', 'rahul@email.com', '$2b$12$hashed', '9812345678', 'buyer', CURRENT_TIMESTAMP),
('priya_tenant', 'priya@email.com', '$2b$12$hashed', '9823456780', 'tenant', CURRENT_TIMESTAMP),
('admin_user', 'admin@realty.com', '$2b$12$hashed', '9834567890', 'admin', CURRENT_TIMESTAMP),
('vikas_buyer', 'vikas@email.com', '$2b$12$hashed', '9845678901', 'buyer', CURRENT_TIMESTAMP),
('meena_tenant', 'meena@email.com', '$2b$12$hashed', '9856789012', 'tenant', CURRENT_TIMESTAMP);

INSERT INTO properties (
  type_id, owner_id, agent_id, location_id, title, price, area_sqft, bedrooms,
  furnishing, listing_type, availability_status, created_at
) VALUES
(4, 1, 2, 1, 'Luxury Villa in Banjara Hills', 35000000, 3200, 4, 'Fully Furnished', 'Sale', 'Available', CURRENT_TIMESTAMP),
(3, 2, 1, 2, '3BHK Sea-View Apartment in Colaba', 18500000, 1450, 3, 'Semi-Furnished', 'Sale', 'Available', CURRENT_TIMESTAMP),
(5, 4, NULL, 3, 'Independent House in Koramangala', 12000000, 1800, 4, 'Unfurnished', 'Sale', 'Sold', CURRENT_TIMESTAMP),
(6, 3, 3, 4, 'Premium Office Space in Connaught Pl.', 9000000, 2200, 0, 'Fully Furnished', 'Lease', 'Available', CURRENT_TIMESTAMP),
(3, 1, 1, 5, '2BHK Apartment in Kothrud', 6000000, 950, 2, 'Semi-Furnished', 'Rent', 'Booked', CURRENT_TIMESTAMP),
(3, 2, 2, 6, '3BHK Apartment in Adyar', 8500000, 1300, 3, 'Unfurnished', 'Sale', 'Available', CURRENT_TIMESTAMP),
(7, 3, 3, 4, 'Retail Shop in Connaught Place', 4000000, 500, 0, 'Unfurnished', 'Sale', 'Available', CURRENT_TIMESTAMP);

INSERT INTO bookings (
  property_id, user_id, booking_date, booking_type, total_amount, status, notes
) VALUES
(1, 1, CURRENT_DATE, 'Purchase', 35000000, 'Completed', 'Advance paid'),
(2, 4, CURRENT_DATE, 'Purchase', 18500000, 'Confirmed', 'Document verification pending'),
(3, 2, CURRENT_DATE, 'Rent', 25000, 'Completed', 'Monthly rental agreement'),
(4, 1, CURRENT_DATE, 'SiteVisit', 0, 'Completed', 'Site visit done'),
(5, 5, CURRENT_DATE, 'Rent', 18000, 'Confirmed', 'Rental confirmed'),
(6, 4, CURRENT_DATE, 'Purchase', 8500000, 'Pending', 'Awaiting bank loan approval'),
(7, 2, CURRENT_DATE, 'SiteVisit', 0, 'Cancelled', 'Changed preference');

INSERT INTO payments (booking_id, amount, payment_date, payment_method, status) VALUES
(1, 500000, CURRENT_TIMESTAMP, 'Bank Transfer', 'Success'),
(1, 34500000, CURRENT_TIMESTAMP, 'NEFT/RTGS', 'Success'),
(2, 1850000, CURRENT_TIMESTAMP, 'UPI', 'Success'),
(3, 25000, CURRENT_TIMESTAMP, 'UPI', 'Success'),
(5, 18000, CURRENT_TIMESTAMP, 'Bank Transfer', 'Success'),
(6, 100000, CURRENT_TIMESTAMP, 'Cheque', 'Pending');

INSERT INTO reviews (property_id, user_id, rating, review_text, created_at) VALUES
(1, 1, 5, 'Excellent villa, worth every rupee! Great views.', CURRENT_TIMESTAMP),
(2, 4, 4, 'Beautiful apartment, sea view is stunning.', CURRENT_TIMESTAMP),
(3, 2, 5, 'Perfect location, smooth transaction.', CURRENT_TIMESTAMP),
(5, 5, 3, 'Decent apartment, but maintenance could be better.', CURRENT_TIMESTAMP),
(1, 4, 4, 'Premium property in great location.', CURRENT_TIMESTAMP);
