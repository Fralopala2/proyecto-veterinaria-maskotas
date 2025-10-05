<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$countryCode = $_GET['country'] ?? '';

// Datos de ejemplo para desarrollo local
$citiesData = [
    'ES' => [
        ['ID' => 1, 'Name' => 'Madrid', 'Population' => 3223334],
        ['ID' => 2, 'Name' => 'Barcelona', 'Population' => 1620343],
        ['ID' => 3, 'Name' => 'Valencia', 'Population' => 791413],
        ['ID' => 4, 'Name' => 'Sevilla', 'Population' => 688711],
        ['ID' => 5, 'Name' => 'Zaragoza', 'Population' => 674317]
    ],
    'FR' => [
        ['ID' => 6, 'Name' => 'Paris', 'Population' => 2161000],
        ['ID' => 7, 'Name' => 'Marseille', 'Population' => 861635],
        ['ID' => 8, 'Name' => 'Lyon', 'Population' => 513275],
        ['ID' => 9, 'Name' => 'Toulouse', 'Population' => 471941],
        ['ID' => 10, 'Name' => 'Nice', 'Population' => 342637]
    ],
    'US' => [
        ['ID' => 11, 'Name' => 'New York', 'Population' => 8175133],
        ['ID' => 12, 'Name' => 'Los Angeles', 'Population' => 3792621],
        ['ID' => 13, 'Name' => 'Chicago', 'Population' => 2695598],
        ['ID' => 14, 'Name' => 'Houston', 'Population' => 2100263],
        ['ID' => 15, 'Name' => 'Phoenix', 'Population' => 1445632]
    ],
    'GB' => [
        ['ID' => 16, 'Name' => 'London', 'Population' => 8982000],
        ['ID' => 17, 'Name' => 'Birmingham', 'Population' => 1141816],
        ['ID' => 18, 'Name' => 'Liverpool', 'Population' => 552858],
        ['ID' => 19, 'Name' => 'Manchester', 'Population' => 547045],
        ['ID' => 20, 'Name' => 'Leeds', 'Population' => 474632]
    ]
];

$cities = $citiesData[$countryCode] ?? [];

echo json_encode([
    'success' => true,
    'cities' => $cities,
    'total' => count($cities),
    'country' => $countryCode
]);
?>