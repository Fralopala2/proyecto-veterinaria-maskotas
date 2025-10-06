-- Easy Level Stored Procedures for MASK!OTAS Database Integration
-- Tarea 2 - Nivel Fácil:
-- 1. Para cada país, de qué ciudades ha habido usuarios que se han registrado y cuántos de cada una
-- 2. Qué país tiene el mayor número de usuarios y cuántos son

USE world;

-- Drop procedures if they exist (for clean setup)
DROP PROCEDURE IF EXISTS SP_UsersByCountryAndCity;
DROP PROCEDURE IF EXISTS SP_CountryWithMostUsers;

-- =====================================================
-- SP_UsersByCountryAndCity
-- Purpose: For each country, show which cities have registered users and how many from each city
-- Returns: Country name, city name, user count per city
-- =====================================================

DELIMITER //

CREATE PROCEDURE SP_UsersByCountryAndCity()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT 
        co.Name AS country_name,
        c.Name AS city_name,
        COUNT(u.user_id) AS user_count
    FROM users u
    INNER JOIN city c ON u.city_id = c.ID
    INNER JOIN country co ON c.CountryCode = co.Code
    GROUP BY co.Code, co.Name, c.ID, c.Name
    ORDER BY co.Name ASC, user_count DESC, c.Name ASC;
END //

DELIMITER ;

-- =====================================================
-- SP_CountryWithMostUsers
-- Purpose: Identify which country has the highest number of users and how many
-- Returns: Country name with highest user count and the total number
-- =====================================================

DELIMITER //

CREATE PROCEDURE SP_CountryWithMostUsers()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT 
        co.Name AS country_name,
        COUNT(u.user_id) AS user_count
    FROM users u
    INNER JOIN city c ON u.city_id = c.ID
    INNER JOIN country co ON c.CountryCode = co.Code
    GROUP BY co.Code, co.Name
    ORDER BY user_count DESC
    LIMIT 1;
END //

DELIMITER ;

-- Verification queries
SELECT 'Easy Level Stored Procedures Created Successfully' AS status;

-- Show created procedures
SHOW PROCEDURE STATUS WHERE Db = 'world' AND Name IN ('SP_UsersByCountryAndCity', 'SP_CountryWithMostUsers');

-- Test the procedures with current data
SELECT 'Testing SP_UsersByCountryAndCity:' AS test_info;
CALL SP_UsersByCountryAndCity();

SELECT 'Testing SP_CountryWithMostUsers:' AS test_info;
CALL SP_CountryWithMostUsers();