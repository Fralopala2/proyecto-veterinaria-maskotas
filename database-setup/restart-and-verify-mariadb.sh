#!/bin/bash

# Script to restart MariaDB service and verify max_connections configuration
# This script applies the configuration changes and verifies they took effect

echo "=== Restarting MariaDB and Verifying Configuration ==="
echo ""

# Check if MariaDB service exists
if ! systemctl list-unit-files | grep -q mariadb; then
    echo "ERROR: MariaDB service not found"
    echo "Please install MariaDB first using: sudo yum install -y mariadb-server.x86_64"
    exit 1
fi

echo "Current MariaDB service status:"
sudo systemctl status mariadb --no-pager -l

echo ""
echo "Restarting MariaDB service..."
sudo systemctl restart mariadb

# Wait a moment for service to fully start
sleep 3

echo "Checking if MariaDB service started successfully..."
if systemctl is-active --quiet mariadb; then
    echo "✓ MariaDB service is running"
else
    echo "✗ ERROR: MariaDB service failed to start"
    echo "Checking service logs:"
    sudo journalctl -u mariadb --no-pager -l --since "1 minute ago"
    exit 1
fi

echo ""
echo "Verifying max_connections configuration:"
echo "----------------------------------------"
sudo mysql -e "SHOW VARIABLES LIKE 'max_conn%';"

echo ""
echo "Checking if max_connections is set to 10:"
MAX_CONN=$(sudo mysql -s -N -e "SELECT @@max_connections;")
if [ "$MAX_CONN" = "10" ]; then
    echo "✓ SUCCESS: max_connections is correctly set to 10"
else
    echo "✗ WARNING: max_connections is set to $MAX_CONN, expected 10"
    echo "Please check the configuration file: /etc/my.cnf.d/server.cnf"
fi

echo ""
echo "Current connection status:"
sudo mysql -e "SHOW STATUS LIKE 'Conn%';"

echo ""
echo "=== Verification Complete ==="