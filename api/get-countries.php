<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir la clase de conexión a la base de datos
require_once '../includes/DatabaseConnection.php';

try {
    $db = DatabaseConnection::getInstance();
    $connection = $db->getConnection();
    
    // Consulta para obtener todos los países ordenados alfabéticamente
    $query = "SELECT Code, Name FROM country ORDER BY Name ASC";
    $result = $connection->query($query);
    
    $countries = [];
    while ($row = $result->fetch_assoc()) {
        $countries[] = [
            'Code' => $row['Code'],
            'Name' => $row['Name']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'countries' => $countries,
        'total' => count($countries)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener países: ' . $e->getMessage()
    ]);
}
?>