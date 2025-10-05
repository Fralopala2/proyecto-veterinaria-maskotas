#!/bin/bash

# Setup users table for MASK!OTAS database integration
# This script creates the users table with proper foreign keys and test data

echo "Setting up users table integrated with world database..."

# Check if MariaDB is running
if ! systemctl is-active --quiet mariadb; then
    echo "MariaDB is not running. Starting MariaDB service..."
    sudo systemctl start mariadb
    sleep 2
fi

# Execute the complete setup script
echo "Creating users table with foreign keys and indexes..."
sudo mysql < database-setup/setup-users-table-complete.sql

if [ $? -eq 0 ]; then
    echo "✓ Users table setup completed successfully!"
    echo ""
    echo "Verifying table structure..."
    sudo mysql -e "USE world; DESCRIBE users;"
    echo ""
    echo "Checking test data..."
    sudo mysql -e "USE world; SELECT COUNT(*) as total_users FROM users;"
else
    echo "✗ Error setting up users table. Check MariaDB logs for details."
    exit 1
fi

echo ""
echo "Users table setup complete. You can now:"
echo "1. Run verification: sudo mysql < database-setup/verify-users-table.sql"
echo "2. Add more test data: sudo mysql < database-setup/insert-test-users.sql"
echo "3. Connect to database: sudo mysql -e 'USE world; SELECT * FROM users;'"