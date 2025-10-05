-- Test data insertion script for users table
-- This script inserts sample users with various cities for testing

USE world;

-- Insert test users with valid city_id references from world database
-- Using cities from different countries for comprehensive testing

-- Get some valid city IDs first (these are from the world database)
-- Amsterdam (Netherlands), New York (USA), Tokyo (Japan), London (UK), Paris (France)

INSERT INTO users (username, email, city_id, connection_start, connection_end, last_connection_duration) VALUES
-- Amsterdam, Netherlands (city_id = 5)
('juan_amsterdam', 'juan@maskotas.com', 5, '2024-01-15 10:00:00', '2024-01-15 10:45:00', 45),

-- New York, USA (city_id = 3793)
('maria_newyork', 'maria@maskotas.com', 3793, '2024-01-15 14:30:00', '2024-01-15 15:15:00', 45),

-- Tokyo, Japan (city_id = 1532)
('carlos_tokyo', 'carlos@maskotas.com', 1532, '2024-01-16 09:00:00', '2024-01-16 09:30:00', 30),

-- London, UK (city_id = 456)
('ana_london', 'ana@maskotas.com', 456, '2024-01-16 16:00:00', '2024-01-16 17:20:00', 80),

-- Paris, France (city_id = 2974)
('pedro_paris', 'pedro@maskotas.com', 2974, '2024-01-17 11:15:00', '2024-01-17 12:00:00', 45),

-- Madrid, Spain (city_id = 653)
('lucia_madrid', 'lucia@maskotas.com', 653, '2024-01-17 13:45:00', '2024-01-17 14:30:00', 45),

-- Berlin, Germany (city_id = 2331)
('miguel_berlin', 'miguel@maskotas.com', 2331, '2024-01-18 08:30:00', '2024-01-18 09:45:00', 75),

-- Rome, Italy (city_id = 2448)
('sofia_rome', 'sofia@maskotas.com', 2448, '2024-01-18 15:00:00', '2024-01-18 16:10:00', 70),

-- Users with recent connections (last month) for testing connection time procedures
('recent_user1', 'recent1@maskotas.com', 5, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY + INTERVAL 2 HOUR, 120),
('recent_user2', 'recent2@maskotas.com', 3793, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 1 HOUR, 60),
('recent_user3', 'recent3@maskotas.com', 1532, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 3 HOUR, 180);

-- Verify insertions
SELECT 
    u.user_id,
    u.username,
    u.email,
    c.Name as city_name,
    co.Name as country_name,
    u.registration_date,
    u.last_connection_duration
FROM users u
JOIN city c ON u.city_id = c.ID
JOIN country co ON c.CountryCode = co.Code
ORDER BY u.registration_date;