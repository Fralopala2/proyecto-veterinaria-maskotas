# Configuración de Base de Datos - MASK!OTAS

## Requisitos
- MariaDB/MySQL 5.7+
- PHP 8.0+
- Apache/Nginx

## Instalación Local

### 1. Configurar Base de Datos
```sql
-- Descargar e importar world database
-- Crear tabla users (ver database-setup/create-users-table.sql)
-- Crear stored procedures (ver database-setup/create-*-stored-procedures.sql)
```

### 2. Configurar PHP
```bash
# Copiar archivo de configuración
cp config/database.example.php config/database.php

# Actualizar credenciales en config/database.php
```

### 3. Estructura de Archivos
```
/var/www/html/
├── api/
│   ├── dashboard-data.php
│   ├── register-user.php
│   ├── get-countries.php
│   └── get-cities.php
├── includes/
│   └── DatabaseConnection.php
├── js/
│   └── connection-tracker.js
└── admin-dashboard.html
```

## Funcionalidades

### Stored Procedures Implementados
- `SP_UsersByCountryAndCity` - Usuarios por país y ciudad
- `SP_CountryWithMostUsers` - País con más usuarios
- `SP_AverageConnectionTimeByCountry` - Tiempo promedio de conexión
- `SP_CitiesConcentrating90PercentUsers` - Ciudades con 90% concentración

### APIs Disponibles
- `GET /api/dashboard-data.php` - Datos del dashboard
- `POST /api/register-user.php` - Registro de usuarios
- `GET /api/get-countries.php` - Lista de países
- `GET /api/get-cities.php?country=XX` - Ciudades por país

### Dashboard Administrativo
Acceso: `/admin-dashboard.html`
- Estadísticas en tiempo real
- Visualización de datos de stored procedures
- Actualización automática cada 5 minutos

## Deployment en AWS
Ver archivos en `aws-setup/` para configuración de EC2 con MariaDB.