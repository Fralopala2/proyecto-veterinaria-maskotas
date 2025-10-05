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
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $city_id = $_POST['city_id'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validaciones básicas
    if (empty($username) || empty($email) || empty($city_id) || empty($password)) {
        throw new Exception('Todos los campos son obligatorios');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email no válido');
    }
    
    if (strlen($password) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }
    
    $db = DatabaseConnection::getInstance();
    $connection = $db->getConnection();
    
    // Verificar si el usuario ya existe
    $checkQuery = "SELECT id FROM users WHERE username = ? OR email = ?";
    $checkStmt = $connection->prepare($checkQuery);
    $checkStmt->bind_param('ss', $username, $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        throw new Exception('El usuario o email ya existe');
    }
    
    // Verificar que la ciudad existe
    $cityQuery = "SELECT ID FROM city WHERE ID = ?";
    $cityStmt = $connection->prepare($cityQuery);
    $cityStmt->bind_param('i', $city_id);
    $cityStmt->execute();
    $cityResult = $cityStmt->get_result();
    
    if ($cityResult->num_rows === 0) {
        throw new Exception('Ciudad no válida');
    }
    
    // Hash de la contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar nuevo usuario
    $insertQuery = "INSERT INTO users (username, email, password_hash, city_id, registration_date, connection_start) VALUES (?, ?, ?, ?, NOW(), NOW())";
    $insertStmt = $connection->prepare($insertQuery);
    $insertStmt->bind_param('sssi', $username, $email, $hashedPassword, $city_id);
    
    if ($insertStmt->execute()) {
        $userId = $connection->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user_id' => $userId,
            'username' => $username
        ]);
    } else {
        throw new Exception('Error al registrar usuario');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>