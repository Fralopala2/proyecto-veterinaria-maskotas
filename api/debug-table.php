<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $host = 'localhost';
    $database = 'world';
    $username = 'root';
    $password = 'maskotas123';
    
    $conn = new mysqli($host, $username, $password, $database);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Verificar estructura de la tabla users
    $result = $conn->query("DESCRIBE users");
    $columns = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row;
        }
    }
    
    // Obtener algunos registros de ejemplo
    $result = $conn->query("SELECT * FROM users LIMIT 5");
    $sampleData = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $sampleData[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'table_structure' => $columns,
        'sample_data' => $sampleData
    ], JSON_PRETTY_PRINT);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>