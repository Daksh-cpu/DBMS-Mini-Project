-- 04_query_revenue_by_type.sql
-- Revenue summary by property type

USE real_estate_db;

SELECT
  pt.type_name,
  COUNT(b.booking_id) AS total_bookings,
  SUM(b.total_amount) AS total_revenue
FROM property_types pt
JOIN properties p ON pt.type_id = p.type_id
JOIN bookings b ON p.property_id = b.property_id
WHERE b.status IN ('Confirmed', 'Completed')
GROUP BY pt.type_id, pt.type_name
ORDER BY total_revenue DESC;
