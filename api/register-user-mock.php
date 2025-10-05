<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Simulación de registro para desarrollo local
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
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
    
    // Simular registro exitoso
    $userId = rand(1000, 9999);
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente (modo demo)',
        'user_id' => $userId,
        'username' => $username,
        'note' => 'Este es un registro simulado para desarrollo local'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>