<?php
// Dashboard API using Stored Procedures - MASK!OTAS
// Tarea 2: Implementación de procedimientos almacenados para análisis de usuarios

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://fralopala2.github.io');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
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
        'generated_at' => date('Y-m-d H:i:s'),
        'procedures_used' => [
            'easy_level' => ['SP_UsersByCountryAndCity', 'SP_CountryWithMostUsers'],
            'difficult_level' => ['SP_CitiesConcentrating90PercentUsers', 'SP_AverageConnectionTimeByCountry']
        ]
    ];
    
    // =====================================================
    // NIVEL FÁCIL - Easy Level Stored Procedures
    // =====================================================
    
    // 1. SP_UsersByCountryAndCity - Para cada país, ciudades con usuarios registrados y cuántos
    $usersByCountryAndCity = [];
    $result = $conn->query("CALL SP_UsersByCountryAndCity()");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $usersByCountryAndCity[] = $row;
        }
        $result->close();
        // Clear any additional result sets
        while ($conn->more_results()) {
            $conn->next_result();
            if ($res = $conn->store_result()) {
                $res->free();
            }
        }
    }
    
    // 2. SP_CountryWithMostUsers - País con mayor número de usuarios
    $countryWithMostUsers = [];
    $result = $conn->query("CALL SP_CountryWithMostUsers()");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $countryWithMostUsers[] = $row;
        }
        $result->close();
        // Clear any additional result sets
        while ($conn->more_results()) {
            $conn->next_result();
            if ($res = $conn->store_result()) {
                $res->free();
            }
        }
    }
    
    // =====================================================
    // NIVEL DIFÍCIL - Difficult Level Stored Procedures
    // =====================================================
    
    // 3. SP_CitiesConcentrating90PercentUsers - Ciudades que concentran 90% de usuarios
    $citiesConcentrating90Percent = [];
    $result = $conn->query("CALL SP_CitiesConcentrating90PercentUsers()");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $citiesConcentrating90Percent[] = $row;
        }
        $result->close();
        // Clear any additional result sets
        while ($conn->more_results()) {
            $conn->next_result();
            if ($res = $conn->store_result()) {
                $res->free();
            }
        }
    }
    
    // 4. SP_AverageConnectionTimeByCountry - Media de tiempo conectado por país (último mes)
    $averageConnectionTime = [];
    $result = $conn->query("CALL SP_AverageConnectionTimeByCountry()");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $averageConnectionTime[] = $row;
        }
        $result->close();
        // Clear any additional result sets
        while ($conn->more_results()) {
            $conn->next_result();
            if ($res = $conn->store_result()) {
                $res->free();
            }
        }
    }
    
    // =====================================================
    // ESTADÍSTICAS ADICIONALES
    // =====================================================
    
    // Total de usuarios
    $result = $conn->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $result ? $result->fetch_assoc()['total'] : 0;
    
    // Total de países únicos (usando los datos reales de la tabla)
    $result = $conn->query("
        SELECT COUNT(DISTINCT co.Code) as total 
        FROM users u 
        INNER JOIN city c ON u.city_id = c.ID 
        INNER JOIN country co ON c.CountryCode = co.Code
    ");
    $totalCountries = $result ? $result->fetch_assoc()['total'] : 0;
    
    // Total de ciudades únicas
    $result = $conn->query("
        SELECT COUNT(DISTINCT c.ID) as total 
        FROM users u 
        INNER JOIN city c ON u.city_id = c.ID
    ");
    $totalCities = $result ? $result->fetch_assoc()['total'] : 0;
    
    // Registros recientes (últimos 7 días)
    $recentUsers = [];
    $result = $conn->query("
        SELECT 
            u.username,
            c.Name as city_name,
            co.Name as country_name,
            u.registration_date
        FROM users u 
        INNER JOIN city c ON u.city_id = c.ID 
        INNER JOIN country co ON c.CountryCode = co.Code
        WHERE u.registration_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY u.registration_date DESC
        LIMIT 20
    ");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $recentUsers[] = $row;
        }
    }
    
    // =====================================================
    // CONSTRUIR RESPUESTA FINAL
    // =====================================================
    
    $response['data'] = [
        // Estadísticas generales
        'totalUsers' => (int)$totalUsers,
        'totalCountries' => (int)$totalCountries,
        'totalCities' => (int)$totalCities,
        'recentUsers' => $recentUsers,
        
        // Nivel Fácil - Stored Procedures
        'usersByCountryAndCity' => $usersByCountryAndCity,
        'countryWithMostUsers' => $countryWithMostUsers,
        
        // Nivel Difícil - Stored Procedures
        'citiesConcentrating90Percent' => $citiesConcentrating90Percent,
        'averageConnectionTime' => $averageConnectionTime
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error del servidor: ' . $e->getMessage(),
        'generated_at' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>