-- Complete users table setup script
-- This script creates the users table, adds indexes, and inserts test data

USE world;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS users;

-- Create users table with city_id foreign key and connection tracking
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    city_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    connection_start TIMESTAMP NULL,
    connection_end TIMESTAMP NULL,
    last_connection_duration INT NULL COMMENT 'Duration in minutes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint to world database city table
    CONSTRAINT fk_users_city 
        FOREIGN KEY (city_id) REFERENCES city(ID) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_city_id ON users(city_id);
CREATE INDEX idx_users_registration_date ON users(registration_date);
CREATE INDEX idx_users_connection_start ON users(connection_start);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_connection_tracking ON users(city_id, connection_start, connection_end);

-- Insert test data
INSERT INTO users (username, email, city_id, connection_start, connection_end, last_connection_duration) VALUES
('juan_amsterdam', 'juan@maskotas.com', 5, '2024-01-15 10:00:00', '2024-01-15 10:45:00', 45),
('maria_newyork', 'maria@maskotas.com', 3793, '2024-01-15 14:30:00', '2024-01-15 15:15:00', 45),
('carlos_tokyo', 'carlos@maskotas.com', 1532, '2024-01-16 09:00:00', '2024-01-16 09:30:00', 30),
('ana_london', 'ana@maskotas.com', 456, '2024-01-16 16:00:00', '2024-01-16 17:20:00', 80),
('pedro_paris', 'pedro@maskotas.com', 2974, '2024-01-17 11:15:00', '2024-01-17 12:00:00', 45),
('lucia_madrid', 'lucia@maskotas.com', 653, '2024-01-17 13:45:00', '2024-01-17 14:30:00', 45),
('miguel_berlin', 'miguel@maskotas.com', 2331, '2024-01-18 08:30:00', '2024-01-18 09:45:00', 75),
('sofia_rome', 'sofia@maskotas.com', 2448, '2024-01-18 15:00:00', '2024-01-18 16:10:00', 70),
('recent_user1', 'recent1@maskotas.com', 5, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY + INTERVAL 2 HOUR, 120),
('recent_user2', 'recent2@maskotas.com', 3793, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 1 HOUR, 60),
('recent_user3', 'recent3@maskotas.com', 1532, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 3 HOUR, 180);

-- Verification queries
SELECT 'Table created successfully' as status;
DESCRIBE users;

SELECT 'Indexes created:' as status;
SHOW INDEX FROM users;

SELECT 'Foreign key constraints:' as status;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'users' 
AND REFERENCED_TABLE_NAME IS NOT NULL;

SELECT 'Test data inserted:' as status;
SELECT 
    u.user_id,
    u.username,
    c.Name as city_name,
    co.Name as country_name,
    u.last_connection_duration
FROM users u
JOIN city c ON u.city_id = c.ID
JOIN country co ON c.CountryCode = co.Code
ORDER BY u.registration_date;