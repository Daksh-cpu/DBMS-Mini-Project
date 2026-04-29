-- 06_transaction_acid_booking.sql
-- ACID-safe booking transaction flow

USE real_estate_db;

SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;

-- Step 1: lock property row and verify availability
SELECT availability_status
FROM properties
WHERE property_id = 4
FOR UPDATE;

-- Step 2: insert booking
INSERT INTO bookings (
  property_id,
  user_id,
  booking_type,
  total_amount,
  status
) VALUES (
  4,
  1,
  'Purchase',
  35000000.00,
  'Confirmed'
);

-- Step 3: insert advance payment
INSERT INTO payments (
  booking_id,
  amount,
  payment_method,
  status
) VALUES (
  LAST_INSERT_ID(),
  500000.00,
  'Bank Transfer',
  'Success'
);

-- Step 4: mark property as booked
UPDATE properties
SET availability_status = 'Booked'
WHERE property_id = 4;

COMMIT;

-- If any step fails, run rollback
-- ROLLBACK;
