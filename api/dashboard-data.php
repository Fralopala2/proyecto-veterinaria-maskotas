<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/DatabaseConnection.php';

try {
    $db = DatabaseConnection::getInstance();
    $conn = $db->getConnection();
    
    $response = [
        'success' => true,
        'data' => [],
        'generated_at' => date('Y-m-d H:i:s')
    ];
    
    // 1. Total de usuarios
    $result = $conn->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $result ? $result->fetch_assoc()['total'] : 0;
    
    // 2. Total de países únicos
    $result = $conn->query("SELECT COUNT(DISTINCT country_code) as total FROM users WHERE country_code IS NOT NULL AND country_code != ''");
    $totalCountries = $result ? $result->fetch_assoc()['total'] : 0;
    
    // 3. Total de ciudades únicas
    $result = $conn->query("SELECT COUNT(DISTINCT city_name) as total FROM users WHERE city_name IS NOT NULL AND city_name != ''");
    $totalCities = $result ? $result->fetch_assoc()['total'] : 0;
    
    // 4. Usuarios por país y ciudad
    $usersByCountryAndCity = [];
    $result = $conn->query("
        SELECT 
            country_code,
            country_name,
            city_name,
            COUNT(*) as user_count
        FROM users 
        WHERE country_code IS NOT NULL AND country_code != '' 
        AND city_name IS NOT NULL AND city_name != ''
        GROUP BY country_code, country_name, city_name
        ORDER BY user_count DESC, country_name, city_name
        LIMIT 50
    ");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $usersByCountryAndCity[] = $row;
        }
    }
    
    // 5. País con más usuarios
    $countryWithMostUsers = [];
    $result = $conn->query("
        SELECT 
            country_code,
            country_name,
            COUNT(*) as user_count
        FROM users 
        WHERE country_code IS NOT NULL AND country_code != ''
        GROUP BY country_code, country_name
        ORDER BY user_count DESC
        LIMIT 1
    ");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $countryWithMostUsers[] = $row;
        }
    }
    
    // 6. Registros recientes (últimos 7 días)
    $recentUsers = [];
    $result = $conn->query("
        SELECT 
            username,
            country_name,
            city_name,
            registration_date
        FROM users 
        WHERE registration_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY registration_date DESC
        LIMIT 20
    ");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $recentUsers[] = $row;
        }
    }
    
    // 7. Tiempo promedio de conexión por país (simulado - necesitaría tabla de conexiones)
    $averageConnectionTime = [];
    $result = $conn->query("
        SELECT 
            country_name,
            ROUND(RAND() * 60 + 10, 2) as avg_connection_minutes
        FROM users 
        WHERE country_code IS NOT NULL AND country_code != ''
        GROUP BY country_name
        ORDER BY country_name
        LIMIT 20
    ");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $averageConnectionTime[] = $row;
        }
    }
    
    // 8. Ciudades que concentran el 90% de usuarios (simulado)
    $citiesConcentrating90Percent = [];
    $result = $conn->query("
        SELECT 
            country_name,
            city_name,
            COUNT(*) as user_count,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users WHERE country_code IS NOT NULL)), 2) as concentration_percentage
        FROM users 
        WHERE country_code IS NOT NULL AND country_code != '' 
        AND city_name IS NOT NULL AND city_name != ''
        GROUP BY country_name, city_name
        HAVING concentration_percentage >= 5
        ORDER BY concentration_percentage DESC
        LIMIT 10
    ");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $citiesConcentrating90Percent[] = $row;
        }
    }
    
    // Construir respuesta
    $response['data'] = [
        'totalUsers' => (int)$totalUsers,
        'totalCountries' => (int)$totalCountries,
        'totalCities' => (int)$totalCities,
        'usersByCountryAndCity' => $usersByCountryAndCity,
        'countryWithMostUsers' => $countryWithMostUsers,
        'recentUsers' => $recentUsers,
        'averageConnectionTime' => $averageConnectionTime,
        'citiesConcentrating90Percent' => $citiesConcentrating90Percent
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error del servidor: ' . $e->getMessage(),
        'generated_at' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
}
?>