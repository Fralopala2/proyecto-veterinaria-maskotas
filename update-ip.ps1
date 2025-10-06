# Script para actualizar automáticamente las IPs del proyecto MASK!OTAS
# Uso: .\update-ip.ps1 -NewIP "107.21.199.133"

param(
    [Parameter(Mandatory=$true)]
    [string]$NewIP
)

# Validar formato de IP
if ($NewIP -notmatch '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$') {
    Write-Host "Error: Formato de IP invalido. Use formato xxx.xxx.xxx.xxx" -ForegroundColor Red
    exit 1
}

Write-Host "Actualizando IP del proyecto MASK!OTAS..." -ForegroundColor Cyan
Write-Host "Nueva IP: $NewIP" -ForegroundColor Green

# Archivos a actualizar
$filesToUpdate = @(
    "js\auth-modals.js",
    "js\connection-tracker.js",
    "api\login-user.php",
    "api\register-user.php",
    "api\dashboard-data-stored-procedures.php",
    "ESTADO-PROYECTO.md",
    "README.md"
)

$oldIPPattern = '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
$updatedFiles = 0
$totalReplacements = 0

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "Procesando: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        # Reemplazar todas las IPs encontradas
        $matches = [regex]::Matches($content, $oldIPPattern)
        if ($matches.Count -gt 0) {
            $replacements = 0
            foreach ($match in $matches) {
                $oldIP = $match.Value
                if ($oldIP -ne $NewIP) {
                    $content = $content -replace [regex]::Escape($oldIP), $NewIP
                    $replacements++
                    $totalReplacements++
                    Write-Host "  Reemplazado: $oldIP -> $NewIP" -ForegroundColor Green
                }
            }
            
            # También actualizar SERVER_IP en API_CONFIG si existe
            if ($content -match "SERVER_IP:\s*'[^']*'") {
                $content = $content -replace "SERVER_IP:\s*'[^']*'", "SERVER_IP: '$NewIP'"
                Write-Host "  SERVER_IP actualizado en API_CONFIG" -ForegroundColor Green
            }
            
            if ($replacements -gt 0) {
                $content | Set-Content $file -NoNewline
                $updatedFiles++
                Write-Host "  Archivo actualizado con $replacements cambios" -ForegroundColor Cyan
            } else {
                Write-Host "  IP ya estaba actualizada" -ForegroundColor Gray
            }
        } else {
            Write-Host "  No se encontraron IPs en este archivo" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Archivo no encontrado: $file" -ForegroundColor Red
    }
}

# Resumen
Write-Host ""
Write-Host "RESUMEN:" -ForegroundColor Cyan
Write-Host "Archivos procesados: $($filesToUpdate.Count)" -ForegroundColor Green
Write-Host "Archivos actualizados: $updatedFiles" -ForegroundColor Green
Write-Host "Total de reemplazos: $totalReplacements" -ForegroundColor Green

if ($totalReplacements -gt 0) {
    Write-Host ""
    Write-Host "Actualizacion completada exitosamente!" -ForegroundColor Green
    Write-Host "Ahora puedes desplegar los cambios a tu instancia EC2:" -ForegroundColor Cyan
    Write-Host "   scp -i Clave_lab.pem js/*.js ec2-user@${NewIP}:/home/ec2-user/" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "No fue necesario realizar cambios." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Para verificar la conectividad:" -ForegroundColor Cyan
Write-Host "ssh -i Clave_lab.pem ec2-user@$NewIP" -ForegroundColor White

# Establecer código de salida exitoso
exit 0