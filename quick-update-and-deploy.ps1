# Script maestro para actualizar IP y desplegar a EC2
# Uso: .\quick-update-and-deploy.ps1 -NewIP "107.21.199.133"

param(
    [Parameter(Mandatory=$true)]
    [string]$NewIP
)

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  MASK!OTAS - Actualizacion Rapida IP  " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Paso 1: Actualizar IPs en el código
Write-Host "PASO 1: Actualizando IPs en archivos..." -ForegroundColor Cyan
& ".\update-ip.ps1" -NewIP $NewIP

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en la actualizacion de IPs. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PASO 2: Desplegando cambios al servidor EC2..." -ForegroundColor Cyan
Write-Host ""

# Pregunta si quiere desplegar automáticamente
$deploy = Read-Host "Deseas desplegar automaticamente los cambios al servidor? (s/n)"

if ($deploy -eq "s" -or $deploy -eq "S" -or $deploy -eq "si" -or $deploy -eq "Si") {
    & ".\deploy-to-ec2.ps1" -ServerIP $NewIP
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "      PROCESO COMPLETADO CON EXITO      " -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
} else {
    Write-Host ""
    Write-Host "Actualizacion de IPs completada." -ForegroundColor Green
    Write-Host "Para desplegar manualmente despues:" -ForegroundColor Cyan
    Write-Host "  .\deploy-to-ec2.ps1 -ServerIP $NewIP" -ForegroundColor White
}

Write-Host ""
Write-Host "URLs para probar:" -ForegroundColor Cyan
Write-Host "  https://$NewIP/" -ForegroundColor White
Write-Host "  https://$NewIP/admin-dashboard.html" -ForegroundColor White
Write-Host ""
Write-Host "Para conectar por SSH:" -ForegroundColor Cyan
Write-Host "  ssh -i aws-setup/Clave_lab.pem ec2-user@$NewIP" -ForegroundColor White