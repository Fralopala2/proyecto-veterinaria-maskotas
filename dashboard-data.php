<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../includes/DatabaseConnection.php';

try {
    $db = DatabaseConnection::getInstance();

    // Get all analytics data
    $analytics = [];

    // 1. Users by Country and City
    $analytics['usersByCountryAndCity'] = $db->callStoredProcedure('SP_UsersByCountryAndCity');

    // 2. Country with Most Users
    $analytics['countryWithMostUsers'] = $db->callStoredProcedure('SP_CountryWithMostUsers');

    // 3. Average Connection Time by Country
    $analytics['averageConnectionTime'] = $db->callStoredProcedure('SP_AverageConnectionTimeByCountry');

    // 4. Cities Concentrating 90% Users (may be empty)
    $analytics['citiesConcentrating90Percent'] = $db->callStoredProcedure('SP_CitiesConcentrating90PercentUsers');
    
    // 5. Additional stats
    $totalUsers = $db->query("SELECT COUNT(*) as total FROM users");
    $analytics['totalUsers'] = $totalUsers[0]['total'] ?? 0;

    $totalCountries = $db->query("SELECT COUNT(DISTINCT co.Code) as total FROM users u INNER JOIN city c ON u.city_id = c.ID INNER JOIN country co ON c.CountryCode = co.Code");
    $analytics['totalCountries'] = $totalCountries[0]['total'] ?? 0;

    $totalCities = $db->query("SELECT COUNT(DISTINCT city_id) as total FROM users");
    $analytics['totalCities'] = $totalCities[0]['total'] ?? 0;

    // 6. Recent registrations (last 7 days)
    $recentUsers = $db->query("SELECT u.username, c.Name as city_name, co.Name as country_name, u.registration_date FROM users u INNER JOIN city c ON u.city_id = c.ID INNER JOIN country co ON c.CountryCode = co.Code WHERE u.registration_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY u.registration_date DESC");
    $analytics['recentUsers'] = $recentUsers;

    echo json_encode([
        'success' => true,
        'data' => $analytics,
        'generated_at' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>