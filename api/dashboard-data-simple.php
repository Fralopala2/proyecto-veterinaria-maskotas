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

try {
    // Conexión directa a la base de datos para debugging
    $host = 'localhost';
    $database = 'world';
    $username = 'root';
    $password = 'maskotas123';
    
    $conn = new mysqli($host, $username, $password, $database);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8");
    
    $response = [
        'success' => true,
        'data' => [],
        'generated_at' => date('Y-m-d H:i:s'),
        'debug' => 'Conexión exitosa'
    ];
    
    // Verificar si la tabla users existe
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows == 0) {
        $response['debug'] = 'Tabla users no existe';
        $response['data'] = [
            'totalUsers' => 0,
            'totalCountries' => 0,
            'totalCities' => 0,
            'usersByCountryAndCity' => [],
            'countryWithMostUsers' => [],
            'recentUsers' => [],
            'averageConnectionTime' => [],
            'citiesConcentrating90Percent' => []
        ];
    } else {
        // Obtener datos básicos
        $result = $conn->query("SELECT COUNT(*) as total FROM users");
        $totalUsers = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Total de países únicos (usando JOIN con city y country)
        $result = $conn->query("
            SELECT COUNT(DISTINCT co.Code) as total 
            FROM users u 
            JOIN city ci ON u.city_id = ci.ID 
            JOIN country co ON ci.CountryCode = co.Code
        ");
        $totalCountries = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Total de ciudades únicas
        $result = $conn->query("
            SELECT COUNT(DISTINCT u.city_id) as total 
            FROM users u 
            WHERE u.city_id IS NOT NULL
        ");
        $totalCities = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Usuarios por país y ciudad
        $usersByCountryAndCity = [];
        $result = $conn->query("
            SELECT 
                co.Code as country_code,
                co.Name as country_name,
                ci.Name as city_name,
                COUNT(*) as user_count
            FROM users u 
            JOIN city ci ON u.city_id = ci.ID 
            JOIN country co ON ci.CountryCode = co.Code
            GROUP BY co.Code, co.Name, ci.Name
            ORDER BY user_count DESC, co.Name, ci.Name
            LIMIT 20
        ");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $usersByCountryAndCity[] = $row;
            }
        }
        
        // País con más usuarios
        $countryWithMostUsers = [];
        $result = $conn->query("
            SELECT 
                co.Code as country_code,
                co.Name as country_name,
                COUNT(*) as user_count
            FROM users u 
            JOIN city ci ON u.city_id = ci.ID 
            JOIN country co ON ci.CountryCode = co.Code
            GROUP BY co.Code, co.Name
            ORDER BY user_count DESC
            LIMIT 1
        ");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $countryWithMostUsers[] = $row;
            }
        }
        
        // Registros recientes (últimos 7 días)
        $recentUsers = [];
        $result = $conn->query("
            SELECT 
                u.username,
                co.Name as country_name,
                ci.Name as city_name,
                u.registration_date
            FROM users u 
            JOIN city ci ON u.city_id = ci.ID 
            JOIN country co ON ci.CountryCode = co.Code
            WHERE u.registration_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY u.registration_date DESC
            LIMIT 10
        ");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $recentUsers[] = $row;
            }
        }
        
        $response['data'] = [
            'totalUsers' => (int)$totalUsers,
            'totalCountries' => (int)$totalCountries,
            'totalCities' => (int)$totalCities,
            'usersByCountryAndCity' => $usersByCountryAndCity,
            'countryWithMostUsers' => $countryWithMostUsers,
            'recentUsers' => $recentUsers,
            'averageConnectionTime' => [], // Simulado - necesitaría tabla de conexiones
            'citiesConcentrating90Percent' => [] // Simulado
        ];
        $response['debug'] = 'Datos completos obtenidos correctamente';
    }
    
    $conn->close();
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