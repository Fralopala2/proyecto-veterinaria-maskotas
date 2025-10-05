-- Verification script for users table
-- This script verifies the users table structure and constraints

USE world;

-- Verify table exists and show structure
DESCRIBE users;

-- Show table creation statement
SHOW CREATE TABLE users;

-- Verify indexes
SHOW INDEX FROM users;

-- Verify foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'users' 
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Check if table is empty (should be 0 rows initially)
SELECT COUNT(*) as user_count FROM users;

-- Verify connection to world database tables
SELECT COUNT(*) as city_count FROM city LIMIT 1;
SELECT COUNT(*) as country_count FROM country LIMIT 1;

-- Test foreign key constraint by attempting to insert invalid city_id
-- This should fail with foreign key constraint error
-- INSERT INTO users (username, email, city_id) VALUES ('test_invalid', 'test@invalid.com', 99999);