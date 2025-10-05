# Setup users table for MASK!OTAS database integration
# This PowerShell script creates the users table with proper foreign keys and test data

Write-Host "Setting up users table integrated with world database..." -ForegroundColor Green

# Check if MariaDB service is running (adjust service name as needed)
$mariadbService = Get-Service -Name "MariaDB" -ErrorAction SilentlyContinue
if ($mariadbService -eq $null) {
    Write-Host "MariaDB service not found. Please ensure MariaDB is installed." -ForegroundColor Red
    exit 1
}

if ($mariadbService.Status -ne "Running") {
    Write-Host "MariaDB is not running. Please start MariaDB service manually." -ForegroundColor Yellow
    Write-Host "You can start it with: net start MariaDB" -ForegroundColor Yellow
    exit 1
}

# Execute the complete setup script
Write-Host "Creating users table with foreign keys and indexes..." -ForegroundColor Yellow

try {
    # Execute the SQL script
    mysql -u root -p < "database-setup/setup-users-table-complete.sql"
    
    Write-Host "✓ Users table setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying table structure..." -ForegroundColor Yellow
    mysql -u root -p -e "USE world; DESCRIBE users;"
    Write-Host ""
    Write-Host "Checking test data..." -ForegroundColor Yellow
    mysql -u root -p -e "USE world; SELECT COUNT(*) as total_users FROM users;"
}
catch {
    Write-Host "✗ Error setting up users table. Check MariaDB connection and credentials." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Users table setup complete. You can now:" -ForegroundColor Green
Write-Host "1. Run verification: mysql -u root -p < database-setup/verify-users-table.sql" -ForegroundColor Cyan
Write-Host "2. Add more test data: mysql -u root -p < database-setup/insert-test-users.sql" -ForegroundColor Cyan
Write-Host "3. Connect to database: mysql -u root -p -e 'USE world; SELECT * FROM users;'" -ForegroundColor Cyan