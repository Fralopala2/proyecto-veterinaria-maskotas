#!/usr/bin/env pwsh
# Script para desplegar archivos actualizados a EC2
# Uso: .\deploy-to-ec2.ps1 -ServerIP "107.21.199.133"

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [string]$KeyFile = "aws-setup/Clave_lab.pem",
    [string]$User = "ec2-user"
)

Write-Host "🚀 Desplegando archivos a EC2..." -ForegroundColor Cyan
Write-Host "📡 Servidor: $ServerIP" -ForegroundColor Yellow

# Verificar que existe el archivo de clave
if (-not (Test-Path $KeyFile)) {
    Write-Error "❌ No se encuentra el archivo de clave: $KeyFile"
    exit 1
}

try {
    Write-Host "`n1️⃣ Subiendo archivos JavaScript..." -ForegroundColor Green
    
    # Subir archivos JS
    scp -i $KeyFile -o StrictHostKeyChecking=no `
        "js/auth-modals.js" `
        "js/connection-tracker.js" `
        "${User}@${ServerIP}:/tmp/"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error subiendo archivos JavaScript"
    }
    
    Write-Host "2️⃣ Subiendo APIs PHP..." -ForegroundColor Green
    
    # Subir APIs PHP
    scp -i $KeyFile -o StrictHostKeyChecking=no `
        "api/login-user.php" `
        "api/register-user.php" `
        "api/dashboard-data-stored-procedures.php" `
        "${User}@${ServerIP}:/tmp/"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error subiendo APIs PHP"
    }
    
    Write-Host "3️⃣ Subiendo dashboard..." -ForegroundColor Green
    
    # Subir dashboard
    scp -i $KeyFile -o StrictHostKeyChecking=no `
        "admin-dashboard.html" `
        "${User}@${ServerIP}:/tmp/"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error subiendo dashboard"
    }
    
    Write-Host "4️⃣ Moviendo archivos a sus ubicaciones finales..." -ForegroundColor Green
    
    # Mover archivos con sudo
    ssh -i $KeyFile -o StrictHostKeyChecking=no "${User}@${ServerIP}" @"
        # Mover archivos JS
        sudo cp /tmp/auth-modals.js /var/www/html/js/auth-modals.js
        sudo cp /tmp/connection-tracker.js /var/www/html/js/connection-tracker.js
        
        # Mover APIs PHP
        sudo cp /tmp/login-user.php /var/www/html/api/login-user.php
        sudo cp /tmp/register-user.php /var/www/html/api/register-user.php
        sudo cp /tmp/dashboard-data-stored-procedures.php /var/www/html/api/dashboard-data-stored-procedures.php
        
        # Mover dashboard
        sudo cp /tmp/admin-dashboard.html /var/www/html/admin-dashboard.html
        
        # Configurar permisos
        sudo chown -R apache:apache /var/www/html/js/
        sudo chown -R apache:apache /var/www/html/api/
        sudo chown apache:apache /var/www/html/admin-dashboard.html
        sudo chmod 644 /var/www/html/js/*.js
        sudo chmod 644 /var/www/html/api/*.php
        sudo chmod 644 /var/www/html/admin-dashboard.html
        
        echo "✅ Archivos desplegados y permisos configurados"
"@
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error moviendo archivos en el servidor"
    }
    
    Write-Host "5️⃣ Reiniciando Apache..." -ForegroundColor Green
    
    # Reiniciar Apache
    ssh -i $KeyFile -o StrictHostKeyChecking=no "${User}@${ServerIP}" @"
        sudo systemctl restart httpd
        sudo systemctl status httpd --no-pager -l
        echo "✅ Apache reiniciado"
"@
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "⚠️ Posible problema reiniciando Apache, pero archivos desplegados"
    }
    
    Write-Host "`n🎉 ¡Despliegue completado exitosamente!" -ForegroundColor Green
    Write-Host "📋 Archivos desplegados:" -ForegroundColor Cyan
    Write-Host "   ✅ JavaScript: auth-modals.js, connection-tracker.js" -ForegroundColor White
    Write-Host "   ✅ APIs PHP: login-user.php, register-user.php, dashboard-data-stored-procedures.php" -ForegroundColor White
    Write-Host "   ✅ Dashboard: admin-dashboard.html" -ForegroundColor White
    
    Write-Host "`n🔗 URLs para probar:" -ForegroundColor Yellow
    Write-Host "   https://$ServerIP/" -ForegroundColor White
    Write-Host "   https://$ServerIP/admin-dashboard.html" -ForegroundColor White
    
} catch {
    Write-Error "❌ Error: $_"
    Write-Host "`n🔍 Para diagnosticar problemas:" -ForegroundColor Yellow
    Write-Host "   ssh -i $KeyFile ${User}@${ServerIP}" -ForegroundColor White
    Write-Host "   sudo tail -f /var/log/httpd/error_log" -ForegroundColor White
    exit 1
}