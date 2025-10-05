#!/bin/bash

# Script para configurar SSL auto-firmado en EC2
# Ejecutar como: sudo bash setup-ssl-ec2.sh

echo "=== Configurando SSL auto-firmado en EC2 para MASK!OTAS ==="

# Actualizar sistema
echo "Actualizando sistema..."
apt update

# Instalar Apache y OpenSSL si no están instalados
echo "Instalando dependencias..."
apt install -y apache2 openssl

# Crear directorio para certificados
mkdir -p /etc/ssl/private
mkdir -p /etc/ssl/certs

# Generar clave privada
echo "Generando clave privada..."
openssl genrsa -out /etc/ssl/private/maskotas-selfsigned.key 2048

# Generar certificado auto-firmado (válido por 365 días)
echo "Generando certificado SSL..."
openssl req -new -x509 -key /etc/ssl/private/maskotas-selfsigned.key \
    -out /etc/ssl/certs/maskotas-selfsigned.crt \
    -days 365 \
    -subj "/C=ES/ST=Valencia/L=Valencia/O=MASKOTAS/OU=Veterinaria/CN=100.26.134.168"

# Configurar Apache para SSL
echo "Configurando Apache SSL..."
cat > /etc/apache2/sites-available/maskotas-ssl.conf << 'EOF'
<IfModule mod_ssl.c>
    <VirtualHost _default_:443>
        ServerAdmin info@maskotas.com
        DocumentRoot /var/www/html
        ServerName 100.26.134.168

        # SSL Configuration
        SSLEngine on
        SSLCertificateFile /etc/ssl/certs/maskotas-selfsigned.crt
        SSLCertificateKeyFile /etc/ssl/private/maskotas-selfsigned.key

        # Headers para CORS - IMPORTANTE para GitHub Pages
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, DELETE, PUT"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept"
        Header always set Access-Control-Allow-Credentials "false"

        # Manejar preflight requests
        RewriteEngine On
        RewriteCond %{REQUEST_METHOD} OPTIONS
        RewriteRule ^(.*)$ $1 [R=200,L]

        <Directory /var/www/html>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
            
            # CORS adicional para archivos PHP
            <FilesMatch "\.(php)$">
                Header always set Access-Control-Allow-Origin "*"
                Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
                Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
            </FilesMatch>
        </Directory>

        # Logs específicos para SSL
        ErrorLog ${APACHE_LOG_DIR}/maskotas_ssl_error.log
        CustomLog ${APACHE_LOG_DIR}/maskotas_ssl_access.log combined
    </VirtualHost>
</IfModule>
EOF

# También actualizar el sitio HTTP para CORS
echo "Configurando CORS en HTTP..."
cat > /etc/apache2/sites-available/000-default.conf << 'EOF'
<VirtualHost *:80>
    ServerAdmin info@maskotas.com
    DocumentRoot /var/www/html
    ServerName 100.26.134.168

    # Headers para CORS
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, DELETE, PUT"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept"
    Header always set Access-Control-Allow-Credentials "false"

    # Manejar preflight requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        <FilesMatch "\.(php)$">
            Header always set Access-Control-Allow-Origin "*"
            Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
            Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
        </FilesMatch>
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/maskotas_error.log
    CustomLog ${APACHE_LOG_DIR}/maskotas_access.log combined
</VirtualHost>
EOF

# Habilitar módulos necesarios
echo "Habilitando módulos de Apache..."
a2enmod ssl
a2enmod headers
a2enmod rewrite

# Habilitar sitios
echo "Habilitando sitios SSL..."
a2ensite maskotas-ssl
a2ensite 000-default

# Verificar configuración
echo "Verificando configuración de Apache..."
apache2ctl configtest

# Reiniciar Apache
echo "Reiniciando Apache..."
systemctl restart apache2

# Verificar estado
echo "Verificando estado de Apache..."
systemctl status apache2 --no-pager

# Abrir puertos en el firewall si está activo
echo "Configurando firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 443/tcp
    ufw allow 80/tcp
    echo "Puertos 80 y 443 abiertos en UFW"
fi

echo ""
echo "=== ✅ SSL CONFIGURADO EXITOSAMENTE ==="
echo ""
echo "🌐 Tu API ahora está disponible en:"
echo "   HTTPS: https://100.26.134.168/api/get-countries.php"
echo "   HTTP:  http://100.26.134.168/api/get-countries.php"
echo ""
echo "🔒 IMPORTANTE:"
echo "   - Los navegadores mostrarán advertencia de certificado auto-firmado"
echo "   - Los usuarios deben hacer clic en 'Avanzado' > 'Continuar al sitio'"
echo "   - Una vez aceptado, el registro funcionará desde GitHub Pages"
echo ""
echo "🧪 Para probar:"
echo "   curl -k https://100.26.134.168/api/get-countries.php"
echo ""
echo "📋 Logs disponibles en:"
echo "   - /var/log/apache2/maskotas_ssl_error.log"
echo "   - /var/log/apache2/maskotas_ssl_access.log"