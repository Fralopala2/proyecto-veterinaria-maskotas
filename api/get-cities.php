<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir la clase de conexión a la base de datos
require_once '../includes/DatabaseConnection.php';

try {
    // Verificar que se proporcione el parámetro country
    if (!isset($_GET['country']) || empty($_GET['country'])) {
        throw new Exception('Parámetro country requerido');
    }
    
    $countryCode = $_GET['country'];
    
    $db = DatabaseConnection::getInstance();
    $connection = $db->getConnection();
    
    // Consulta para obtener ciudades del país especificado
    $query = "SELECT ID, Name, Population FROM city WHERE CountryCode = ? ORDER BY Name ASC";
    $stmt = $connection->prepare($query);
    $stmt->bind_param('s', $countryCode);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $cities = [];
    while ($row = $result->fetch_assoc()) {
        $cities[] = [
            'ID' => $row['ID'],
            'Name' => $row['Name'],
            'Population' => $row['Population']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'cities' => $cities,
        'total' => count($cities),
        'country' => $countryCode
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener ciudades: ' . $e->getMessage()
    ]);
}
?>