#!/bin/bash

echo "Subiendo archivos actualizados del dashboard..."

# Subir el archivo PHP actualizado al servidor
scp -i Clave_lab.pem api/dashboard-data-simple.php ec2-user@100.26.134.168:/tmp/

# Conectar al servidor y mover el archivo
ssh -i Clave_lab.pem ec2-user@100.26.134.168 << 'EOF'
    echo "Moviendo archivo al directorio web..."
    sudo cp /tmp/dashboard-data-simple.php /var/www/html/api/
    sudo chown apache:apache /var/www/html/api/dashboard-data-simple.php
    sudo chmod 644 /var/www/html/api/dashboard-data-simple.php
    
    echo "Verificando permisos..."
    ls -la /var/www/html/api/dashboard-data-simple.php
    
    echo "Verificando sintaxis PHP..."
    php -l /var/www/html/api/dashboard-data-simple.php
    
    echo "Probando la API..."
    curl -s http://localhost/api/dashboard-data-simple.php | head -20
EOF

echo "✅ Archivo subido correctamente!"