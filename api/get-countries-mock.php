<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Datos de ejemplo para desarrollo local
$countries = [
    ['Code' => 'ES', 'Name' => 'Spain'],
    ['Code' => 'FR', 'Name' => 'France'],
    ['Code' => 'DE', 'Name' => 'Germany'],
    ['Code' => 'IT', 'Name' => 'Italy'],
    ['Code' => 'PT', 'Name' => 'Portugal'],
    ['Code' => 'GB', 'Name' => 'United Kingdom'],
    ['Code' => 'US', 'Name' => 'United States'],
    ['Code' => 'CA', 'Name' => 'Canada'],
    ['Code' => 'MX', 'Name' => 'Mexico'],
    ['Code' => 'BR', 'Name' => 'Brazil'],
    ['Code' => 'AR', 'Name' => 'Argentina'],
    ['Code' => 'JP', 'Name' => 'Japan'],
    ['Code' => 'CN', 'Name' => 'China'],
    ['Code' => 'IN', 'Name' => 'India'],
    ['Code' => 'AU', 'Name' => 'Australia']
];

echo json_encode([
    'success' => true,
    'countries' => $countries,
    'total' => count($countries)
]);
?>