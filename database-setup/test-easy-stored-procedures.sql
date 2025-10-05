-- Test script for Easy Level Stored Procedures
-- This script tests the functionality of the easy level stored procedures

USE world;

-- Test 1: Verify procedures exist
SELECT 'Checking if stored procedures exist:' AS test_info;
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    CREATED,
    LAST_ALTERED
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'world' 
AND ROUTINE_NAME IN ('SP_UsersByCountryAndCity', 'SP_CountryWithMostUsers');

-- Test 2: Execute SP_UsersByCountryAndCity
SELECT 'Executing SP_UsersByCountryAndCity:' AS test_info;
CALL SP_UsersByCountryAndCity();

-- Test 3: Execute SP_CountryWithMostUsers
SELECT 'Executing SP_CountryWithMostUsers:' AS test_info;
CALL SP_CountryWithMostUsers();

-- Test 4: Verify data integrity - show raw data for comparison
SELECT 'Raw data for verification:' AS test_info;
SELECT 
    co.Name AS country_name,
    c.Name AS city_name,
    COUNT(u.user_id) AS user_count
FROM users u
INNER JOIN city c ON u.city_id = c.ID
INNER JOIN country co ON c.CountryCode = co.Code
GROUP BY co.Code, co.Name, c.ID, c.Name
ORDER BY co.Name ASC, user_count DESC;

-- Test 5: Show total users per country for verification
SELECT 'Total users per country:' AS test_info;
SELECT 
    co.Name AS country_name,
    COUNT(u.user_id) AS total_users
FROM users u
INNER JOIN city c ON u.city_id = c.ID
INNER JOIN country co ON c.CountryCode = co.Code
GROUP BY co.Code, co.Name
ORDER BY total_users DESC;