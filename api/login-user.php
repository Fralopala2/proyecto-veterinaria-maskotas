<?php
// Handle preflight OPTIONS request first
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: https://fralopala2.github.io');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://fralopala2.github.io');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Incluir la clase de conexión a la base de datos
require_once '../includes/DatabaseConnection.php';

try {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Obtener datos del formulario
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validaciones básicas
    if (empty($email) || empty($password)) {
        throw new Exception('Email y contraseña son obligatorios');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email no válido');
    }
    
    $db = DatabaseConnection::getInstance();
    $connection = $db->getConnection();
    
    // Buscar usuario por email
    $query = "SELECT user_id, username, email, password_hash, city_id FROM users WHERE email = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Email o contraseña incorrectos');
    }
    
    $user = $result->fetch_assoc();
    
    // Verificar contraseña
    if (!password_verify($password, $user['password_hash'])) {
        throw new Exception('Email o contraseña incorrectos');
    }
    
    // Actualizar tiempo de conexión
    $updateQuery = "UPDATE users SET connection_start = NOW() WHERE user_id = ?";
    $updateStmt = $connection->prepare($updateQuery);
    $updateStmt->bind_param('i', $user['user_id']);
    $updateStmt->execute();
    
    // Login exitoso
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
            'user_id' => $user['user_id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>