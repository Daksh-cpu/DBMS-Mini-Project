-- 03_query_full_listing.sql
-- Full property listing with related entities

USE real_estate_db;

SELECT
  p.property_id,
  p.title,
  p.price,
  p.area_sqft,
  p.furnishing,
  p.listing_type,
  pt.type_name AS property_type,
  l.city,
  l.locality,
  o.owner_name,
  a.agent_name
FROM properties p
JOIN property_types pt ON p.type_id = pt.type_id
JOIN locations l ON p.location_id = l.location_id
JOIN owners o ON p.owner_id = o.owner_id
LEFT JOIN agents a ON p.agent_id = a.agent_id
WHERE p.availability_status = 'Available'
ORDER BY p.price DESC;
