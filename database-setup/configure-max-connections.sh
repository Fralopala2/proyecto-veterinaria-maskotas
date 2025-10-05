#!/bin/bash

# Script to configure MariaDB max_connections setting
# This script modifies /etc/my.cnf.d/server.cnf to set max_connections = 10

echo "=== Configuring MariaDB max_connections Setting ==="
echo ""

# Check if MariaDB is installed
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MariaDB is not installed"
    echo "Please install MariaDB first using: sudo yum install -y mariadb-server.x86_64"
    exit 1
fi

# Configuration file path
CONFIG_FILE="/etc/my.cnf.d/server.cnf"

echo "Checking if configuration file exists: $CONFIG_FILE"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Creating configuration file: $CONFIG_FILE"
    sudo touch "$CONFIG_FILE"
fi

# Backup existing configuration
BACKUP_FILE="/etc/my.cnf.d/server.cnf.backup.$(date +%Y%m%d_%H%M%S)"
echo "Creating backup of existing configuration: $BACKUP_FILE"
sudo cp "$CONFIG_FILE" "$BACKUP_FILE"

# Check if [mysqld] section exists
if ! grep -q "^\[mysqld\]" "$CONFIG_FILE"; then
    echo "Adding [mysqld] section to configuration file"
    echo "[mysqld]" | sudo tee -a "$CONFIG_FILE" > /dev/null
fi

# Remove existing max_connections setting if it exists
sudo sed -i '/^max_connections\|^max-connections/d' "$CONFIG_FILE"

# Add max_connections = 10 under [mysqld] section
echo "Adding max_connections = 10 to configuration"
sudo sed -i '/^\[mysqld\]/a max_connections = 10' "$CONFIG_FILE"

echo ""
echo "Configuration file updated. Contents:"
echo "----------------------------------------"
sudo cat "$CONFIG_FILE"
echo "----------------------------------------"

echo ""
echo "=== Configuration Complete ==="
echo "Next step: Run restart-and-verify-mariadb.sh to apply changes"