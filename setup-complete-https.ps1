# Script para configurar HTTPS automáticamente en AWS EC2
# Ejecutar después de cambio de IP para habilitar conexión desde GitHub Pages

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP
)

Write-Host "🔐 Configurando HTTPS para IP: $ServerIP" -ForegroundColor Cyan

# 1. Actualizar todas las IPs en el proyecto
Write-Host "📋 Paso 1: Actualizando IPs en el proyecto..." -ForegroundColor Yellow
& ".\update-ip.ps1" -NewIP $ServerIP

# 2. Generar certificado SSL con la nueva IP
Write-Host "📋 Paso 2: Generando certificado SSL..." -ForegroundColor Yellow
$sslScript = @"
#!/bin/bash
# Generar certificado SSL autofirmado
sudo mkdir -p /etc/ssl/certs /etc/ssl/private

# Crear certificado con la IP como CN y SAN
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/apache-selfsigned.key \
    -out /etc/ssl/certs/apache-selfsigned.crt \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=MASKIOTAS/CN=$ServerIP" \
    -addext "subjectAltName=IP:$ServerIP"

echo "✅ Certificado SSL generado"
"@

$sslScript | ssh -i "Clave_lab.pem" -o StrictHostKeyChecking=no ec2-user@$ServerIP 'cat > ~/setup-ssl.sh && chmod +x ~/setup-ssl.sh && ./setup-ssl.sh && rm ~/setup-ssl.sh'

# 3. Crear configuración de Apache con CORS
Write-Host "📋 Paso 3: Configurando Apache con CORS..." -ForegroundColor Yellow
$apacheConfig = @"
<VirtualHost *:443>
    ServerName $ServerIP
    DocumentRoot /var/www/html
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/apache-selfsigned.crt
    SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key
    
    # CORS Headers para GitHub Pages
    Header always set Access-Control-Allow-Origin "https://fralopala2.github.io"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "false"
    
    # Manejar preflight OPTIONS requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
    
    ErrorLog /var/log/httpd/ssl_error.log
    CustomLog /var/log/httpd/ssl_access.log combined
</VirtualHost>

<VirtualHost *:80>
    ServerName $ServerIP
    DocumentRoot /var/www/html
    
    # CORS también para HTTP
    Header always set Access-Control-Allow-Origin "https://fralopala2.github.io"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</VirtualHost>
"@

# Crear archivo temporal y subirlo
$tempFile = [System.IO.Path]::GetTempFileName()
$apacheConfig | Out-File -FilePath $tempFile -Encoding UTF8
scp -i "Clave_lab.pem" -o StrictHostKeyChecking=no $tempFile ec2-user@${ServerIP}:~/ssl-maskiotas.conf
Remove-Item $tempFile

# 4. Instalar configuración y reiniciar Apache
Write-Host "📋 Paso 4: Instalando configuración y reiniciando Apache..." -ForegroundColor Yellow
ssh -i "Clave_lab.pem" -o StrictHostKeyChecking=no ec2-user@$ServerIP @"
sudo mv ~/ssl-maskiotas.conf /etc/httpd/conf.d/
sudo systemctl restart httpd
sudo systemctl status httpd --no-pager -l
"@

# 5. Verificar que funcione
Write-Host "📋 Paso 5: Verificando conectividad..." -ForegroundColor Yellow
try {
    $httpTest = Invoke-WebRequest -Uri "http://$ServerIP" -TimeoutSec 10 -UseBasicParsing
    $httpsTest = Invoke-WebRequest -Uri "https://$ServerIP" -TimeoutSec 10 -UseBasicParsing -SkipCertificateCheck
    
    Write-Host "✅ HTTP Status: $($httpTest.StatusCode)" -ForegroundColor Green
    Write-Host "✅ HTTPS Status: $($httpsTest.StatusCode)" -ForegroundColor Green
    
    # Verificar headers CORS
    $corsHeader = $httpsTest.Headers.'Access-Control-Allow-Origin'
    if ($corsHeader -eq "https://fralopala2.github.io") {
        Write-Host "✅ CORS configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️ CORS header: $corsHeader" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error verificando conectividad: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Subir archivos actualizados
Write-Host "📋 Paso 6: Subiendo archivos actualizados..." -ForegroundColor Yellow
& ".\deploy-login-fix.ps1" -ServerIP $ServerIP

Write-Host ""
Write-Host "🎉 CONFIGURACIÓN COMPLETA!" -ForegroundColor Green
Write-Host "   ✅ Certificado SSL generado" -ForegroundColor Green
Write-Host "   ✅ Apache configurado con HTTPS" -ForegroundColor Green  
Write-Host "   ✅ CORS habilitado para GitHub Pages" -ForegroundColor Green
Write-Host "   ✅ APIs actualizadas y desplegadas" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   HTTP:  http://$ServerIP" -ForegroundColor White
Write-Host "   HTTPS: https://$ServerIP" -ForegroundColor White
Write-Host "   Test:  https://$ServerIP/test-login-https.html" -ForegroundColor White
Write-Host ""
Write-Host "🔗 GitHub Pages puede ahora conectarse via HTTPS" -ForegroundColor Cyan