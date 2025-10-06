-- Difficult Level Stored Procedures for MASK!OTAS Database Integration
-- Tarea 2 - Nivel Difícil:
-- 1. Para los países con usuarios registrados, qué ciudades más grandes concentran el 90% de usuarios
-- 2. La media de tiempo que pasa conectado cada usuario en el último mes, por país

USE world;

-- Drop procedures if they exist (for clean setup)
DROP PROCEDURE IF EXISTS SP_CitiesConcentrating90PercentUsers;
DROP PROCEDURE IF EXISTS SP_AverageConnectionTimeByCountry;

-- =====================================================
-- SP_CitiesConcentrating90PercentUsers
-- Purpose: For countries with registered users, identify which largest cities concentrate 90% of users
-- Returns: Country name, city name, user count, percentage concentration
-- =====================================================

DELIMITER //

CREATE PROCEDURE SP_CitiesConcentrating90PercentUsers()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Create temporary table with country totals and city counts
    DROP TEMPORARY TABLE IF EXISTS temp_country_totals;
    CREATE TEMPORARY TABLE temp_country_totals AS
    SELECT 
        co.Code AS country_code,
        co.Name AS country_name,
        COUNT(u.user_id) AS total_users_in_country
    FROM users u
    INNER JOIN city c ON u.city_id = c.ID
    INNER JOIN country co ON c.CountryCode = co.Code
    GROUP BY co.Code, co.Name;

    -- Create temporary table with city counts and running totals
    DROP TEMPORARY TABLE IF EXISTS temp_city_analysis;
    CREATE TEMPORARY TABLE temp_city_analysis AS
    SELECT 
        co.Code AS country_code,
        co.Name AS country_name,
        c.Name AS city_name,
        COUNT(u.user_id) AS city_user_count,
        tct.total_users_in_country,
        (COUNT(u.user_id) * 100.0 / tct.total_users_in_country) AS city_percentage
    FROM users u
    INNER JOIN city c ON u.city_id = c.ID
    INNER JOIN country co ON c.CountryCode = co.Code
    INNER JOIN temp_country_totals tct ON co.Code = tct.country_code
    GROUP BY co.Code, co.Name, c.ID, c.Name, tct.total_users_in_country
    ORDER BY co.Name, city_user_count DESC;

    -- Select cities that individually have >= 90% or are part of top cities reaching 90%
    SELECT 
        country_name,
        city_name,
        city_user_count,
        ROUND(city_percentage, 2) AS concentration_percentage
    FROM temp_city_analysis
    WHERE city_percentage >= 90.0
       OR (country_code, city_name) IN (
           -- Get top cities per country until reaching 90%
           SELECT DISTINCT t1.country_code, t1.city_name
           FROM temp_city_analysis t1
           WHERE (
               SELECT SUM(t2.city_percentage)
               FROM temp_city_analysis t2
               WHERE t2.country_code = t1.country_code
                 AND t2.city_user_count >= t1.city_user_count
           ) <= 90.0
       )
    ORDER BY country_name, city_user_count DESC;

    -- Clean up temporary tables
    DROP TEMPORARY TABLE IF EXISTS temp_country_totals;
    DROP TEMPORARY TABLE IF EXISTS temp_city_analysis;
END //

DELIMITER ;

-- =====================================================
-- SP_AverageConnectionTimeByCountry
-- Purpose: Calculate average connection time per user in the last month, grouped by country
-- Returns: Country name, average connection time in minutes
-- Note: Uses connection_start and connection_end fields, filters for last 30 days
-- =====================================================

DELIMITER //

CREATE PROCEDURE SP_AverageConnectionTimeByCountry()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT 
        co.Name AS country_name,
        ROUND(AVG(
            CASE 
                WHEN u.connection_start IS NOT NULL AND u.connection_end IS NOT NULL
                THEN TIMESTAMPDIFF(MINUTE, u.connection_start, u.connection_end)
                WHEN u.connection_start IS NOT NULL AND u.connection_end IS NULL
                THEN TIMESTAMPDIFF(MINUTE, u.connection_start, NOW())
                ELSE NULL
            END
        ), 2) AS avg_connection_minutes,
        COUNT(CASE 
            WHEN u.connection_start IS NOT NULL 
                AND u.connection_start >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            THEN 1 
            ELSE NULL 
        END) AS active_users_last_month
    FROM users u
    INNER JOIN city c ON u.city_id = c.ID
    INNER JOIN country co ON c.CountryCode = co.Code
    WHERE u.connection_start IS NOT NULL
      AND u.connection_start >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY co.Code, co.Name
    HAVING COUNT(u.user_id) > 0
    ORDER BY avg_connection_minutes DESC;
END //

DELIMITER ;

-- Verification queries
SELECT 'Difficult Level Stored Procedures Created Successfully' AS status;

-- Show created procedures
SHOW PROCEDURE STATUS WHERE Db = 'world' AND Name IN ('SP_CitiesConcentrating90PercentUsers', 'SP_AverageConnectionTimeByCountry');

-- Test the procedures with current data
SELECT 'Testing SP_CitiesConcentrating90PercentUsers:' AS test_info;
CALL SP_CitiesConcentrating90PercentUsers();

SELECT 'Testing SP_AverageConnectionTimeByCountry:' AS test_info;
CALL SP_AverageConnectionTimeByCountry();