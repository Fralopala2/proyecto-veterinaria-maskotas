#!/bin/bash

# Script to check current max_connections value in MariaDB
# This script displays the current max_connections setting

echo "=== Checking Current MariaDB max_connections Setting ==="
echo ""

# Check if MariaDB service is running
if ! systemctl is-active --quiet mariadb; then
    echo "ERROR: MariaDB service is not running"
    echo "Please start MariaDB service first: sudo systemctl start mariadb"
    exit 1
fi

echo "Current max_connections setting:"
sudo mysql -e "SHOW VARIABLES LIKE 'max_conn%';"

echo ""
echo "Current active connections:"
sudo mysql -e "SHOW STATUS LIKE 'Conn%';"

echo ""
echo "=== Check Complete ==="