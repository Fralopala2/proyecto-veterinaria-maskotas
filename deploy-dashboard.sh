#!/bin/bash

echo "Desplegando archivos del dashboard..."

# Copiar el archivo PHP del backend
echo "Copiando dashboard-data.php..."
sudo cp dashboard-data.php /var/www/html/api/
sudo chown apache:apache /var/www/html/api/dashboard-data.php
sudo chmod 644 /var/www/html/api/dashboard-data.php

# Copiar el archivo HTML del dashboard
echo "Copiando admin-dashboard.html..."
sudo cp admin-dashboard.html /var/www/html/
sudo chown apache:apache /var/www/html/admin-dashboard.html
sudo chmod 644 /var/www/html/admin-dashboard.html

echo "✅ Dashboard desplegado correctamente!"
echo ""
echo "Puedes acceder al dashboard en:"
echo "http://tu-ip-publica/admin-dashboard.html"
echo ""
echo "API endpoint disponible en:"
echo "http://tu-ip-publica/api/dashboard-data.php"