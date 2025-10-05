#!/bin/bash

# Script para configurar SSL auto-firmado en EC2
# Ejecutar como: sudo bash setup-ssl-ec2.sh

echo "=== Configurando SSL auto-firmado en EC2 ==="

# Actualizar sistema
apt update

# Instalar OpenSSL si no está instalado
apt install -y openssl

# Crear directorio para certificados
mkdir -p /etc/ssl/private
mkdir -p /etc/ssl/certs

# Generar clave privada
openssl genrsa -out /etc/ssl/private/apache-selfsigned.key 2048

# Generar certificado auto-firmado (válido por 365 días)
openssl req -new -x509 -key /etc/ssl/private/apache-selfsigned.key \
    -out /etc/ssl/certs/apache-selfsigned.crt \
    -days 365 \
    -subj "/C=ES/ST=Valencia/L=Valencia/O=MASKOTAS/OU=IT/CN=54.167.110.190"

# Configurar Apache para SSL
cat > /etc/apache2/sites-available/default-ssl.conf << 'EOF'
<IfModule mod_ssl.c>
    <VirtualHost _default_:443>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        # SSL Configuration
        SSLEngine on
        SSLCertificateFile /etc/ssl/certs/apache-selfsigned.crt
        SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key

        # Headers para CORS
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, DELETE, PUT"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

        <Directory /var/www/html>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/ssl_error.log
        CustomLog ${APACHE_LOG_DIR}/ssl_access.log combined
    </VirtualHost>
</IfModule>
EOF

# Habilitar módulos necesarios
a2enmod ssl
a2enmod headers
a2enmod rewrite

# Habilitar sitio SSL
a2ensite default-ssl

# Reiniciar Apache
systemctl restart apache2

# Verificar estado
systemctl status apache2

echo "=== SSL configurado ==="
echo "Tu API ahora está disponible en:"
echo "HTTPS: https://54.167.110.190/api/get-countries.php"
echo "HTTP:  http://54.167.110.190/api/get-countries.php"
echo ""
echo "NOTA: Los navegadores mostrarán advertencia de certificado auto-firmado"
echo "Los usuarios deberán hacer clic en 'Avanzado' > 'Continuar al sitio'"