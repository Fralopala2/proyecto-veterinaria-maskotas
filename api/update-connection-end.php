<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir la clase de conexión a la base de datos
require_once '../includes/DatabaseConnection.php';

try {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Obtener datos del formulario
    $connection_id = $_POST['connection_id'] ?? '';
    $duration = $_POST['duration'] ?? 0;
    $end_time = $_POST['end_time'] ?? '';
    
    // Por ahora, como no tenemos sistema de login completo,
    // vamos a simular la actualización de conexión
    // En una implementación real, buscarías el usuario por session/token
    
    $db = DatabaseConnection::getInstance();
    $connection = $db->getConnection();
    
    // Actualizar el último usuario que se conectó (simulación)
    $updateQuery = "UPDATE users SET connection_end = NOW() WHERE connection_end IS NULL ORDER BY connection_start DESC LIMIT 1";
    $result = $connection->query($updateQuery);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Conexión actualizada',
            'connection_id' => $connection_id,
            'duration' => $duration
        ]);
    } else {
        throw new Exception('Error al actualizar conexión');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>