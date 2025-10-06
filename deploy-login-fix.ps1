# Script simple para desplegar archivos del login
param([Parameter(Mandatory=$true)][string]$ServerIP)

Write-Host "Desplegando login fix..." -ForegroundColor Cyan

$keyFile = "Clave_lab.pem"
if (-not (Test-Path $keyFile)) {
    $keyFile = "aws-setup\Clave_lab.pem"
}

Write-Host "Copiando archivos principales..." -ForegroundColor Yellow

# Copiar archivos uno por uno
Write-Host "1. Copiando login-user.php..."
scp -i "$keyFile" -o StrictHostKeyChecking=no "api\login-user.php" "ec2-user@${ServerIP}:~/"
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo cp ~/login-user.php /var/www/html/api/"

Write-Host "2. Copiando auth-modals.js..."
scp -i "$keyFile" -o StrictHostKeyChecking=no "js\auth-modals.js" "ec2-user@${ServerIP}:~/"
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo cp ~/auth-modals.js /var/www/html/js/"

Write-Host "3. Copiando style.css..."
scp -i "$keyFile" -o StrictHostKeyChecking=no "style.css" "ec2-user@${ServerIP}:~/"
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo cp ~/style.css /var/www/html/"

Write-Host "4. Copiando test-login.html..."
scp -i "$keyFile" -o StrictHostKeyChecking=no "test-login.html" "ec2-user@${ServerIP}:~/"
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo cp ~/test-login.html /var/www/html/"

Write-Host "5. Copiando create-test-user.sql..."
scp -i "$keyFile" -o StrictHostKeyChecking=no "database-setup\create-test-user.sql" "ec2-user@${ServerIP}:~/"

Write-Host "Configurando permisos..." -ForegroundColor Yellow
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo chown apache:apache /var/www/html/api/login-user.php /var/www/html/js/auth-modals.js /var/www/html/style.css /var/www/html/test-login.html"
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo chmod 644 /var/www/html/api/login-user.php /var/www/html/js/auth-modals.js /var/www/html/style.css /var/www/html/test-login.html"

Write-Host "Reiniciando Apache..." -ForegroundColor Yellow
ssh -i "$keyFile" -o StrictHostKeyChecking=no ec2-user@$ServerIP "sudo systemctl restart httpd"

Write-Host ""
Write-Host "LOGIN FIX DESPLEGADO!" -ForegroundColor Green
Write-Host ""
Write-Host "PASOS SIGUIENTES:" -ForegroundColor Cyan
Write-Host "1. Crear usuario de prueba:"
Write-Host "   ssh -i $keyFile ec2-user@$ServerIP"
Write-Host "   mysql -u root world < create-test-user.sql"
Write-Host ""
Write-Host "2. Probar login:"
Write-Host "   http://$ServerIP/test-login.html"
Write-Host "   Usuario: test@maskiotas.com"
Write-Host "   Password: password123"
Write-Host ""
Write-Host "3. Sitio principal:"
Write-Host "   http://$ServerIP/index.html"