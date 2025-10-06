-- Add password field to users table for authentication
-- This script adds the missing password_hash field to enable proper user authentication

USE world;

-- Add password_hash field to users table
ALTER TABLE users 
ADD COLUMN password_hash VARCHAR(255) NOT NULL AFTER email;

-- Show updated table structure
DESCRIBE users;

-- Optional: Create a test user for verification
-- Password is '123456' hashed with PHP password_hash()
INSERT INTO users (username, email, password_hash, city_id, registration_date, connection_start) 
VALUES (
    'test_user', 
    'test@test.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    1, 
    NOW(), 
    NOW()
) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

SELECT 'Password field added successfully' as status;