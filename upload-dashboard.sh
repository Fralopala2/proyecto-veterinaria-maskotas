#!/bin/bash

echo "Subiendo dashboard-data.php al servidor..."

# Subir el archivo PHP al servidor
scp -i tu-clave.pem api/dashboard-data.php ec2-user@100.26.134.168:/tmp/

# Conectar al servidor y mover el archivo
ssh -i tu-clave.pem ec2-user@100.26.134.168 << 'EOF'
    echo "Moviendo archivo al directorio web..."
    sudo cp /tmp/dashboard-data.php /var/www/html/api/
    sudo chown apache:apache /var/www/html/api/dashboard-data.php
    sudo chmod 644 /var/www/html/api/dashboard-data.php
    
    echo "Verificando permisos..."
    ls -la /var/www/html/api/dashboard-data.php
    
    echo "Verificando sintaxis PHP..."
    php -l /var/www/html/api/dashboard-data.php
EOF

echo "✅ Archivo subido correctamente!"