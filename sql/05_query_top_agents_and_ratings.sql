-- 05_query_top_agents_and_ratings.sql
-- Top 5 agents by booking performance + property rating aggregation

USE real_estate_db;

SELECT
  a.agent_name,
  a.agency_name,
  COUNT(b.booking_id) AS total_bookings,
  SUM(b.total_amount) AS total_transaction_value
FROM agents a
JOIN properties p ON a.agent_id = p.agent_id
JOIN bookings b ON p.property_id = b.property_id
WHERE b.status IN ('Confirmed', 'Completed')
GROUP BY a.agent_id, a.agent_name, a.agency_name
ORDER BY total_bookings DESC
LIMIT 5;

SELECT
  p.title,
  l.city,
  ROUND(AVG(r.rating), 2) AS avg_rating,
  COUNT(r.review_id) AS review_count
FROM properties p
JOIN locations l ON p.location_id = l.location_id
LEFT JOIN reviews r ON p.property_id = r.property_id
GROUP BY p.property_id, p.title, l.city
HAVING review_count > 0
ORDER BY avg_rating DESC, review_count DESC;
