#!/bin/bash

# MariaDB Service Startup Script
# This script starts and enables MariaDB service using the exact commands specified

echo "Starting MariaDB service configuration..."

# Start MariaDB service
echo "Starting MariaDB service..."
sudo systemctl start mariadb

# Check if start was successful
if [ $? -eq 0 ]; then
    echo "MariaDB service started successfully"
else
    echo "ERROR: Failed to start MariaDB service"
    exit 1
fi

# Enable MariaDB service to start on boot
echo "Enabling MariaDB service for auto-start..."
sudo systemctl enable mariadb

# Check if enable was successful
if [ $? -eq 0 ]; then
    echo "MariaDB service enabled for auto-start successfully"
else
    echo "ERROR: Failed to enable MariaDB service"
    exit 1
fi

# Verify service status
echo "Checking MariaDB service status..."
sudo systemctl status mariadb --no-pager

echo "MariaDB service startup script completed"