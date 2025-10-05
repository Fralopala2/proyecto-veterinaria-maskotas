#!/bin/bash

# MariaDB Installation Script
# This script installs MariaDB server on Amazon Linux using the exact command specified

echo "Starting MariaDB installation..."

# Install MariaDB server with exact command from requirements
sudo yum install -y mariadb-server.x86_64

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "MariaDB server installation completed successfully"
    
    # Display installed version
    echo "Checking MariaDB version..."
    rpm -qa | grep mariadb
else
    echo "ERROR: MariaDB installation failed"
    exit 1
fi

echo "MariaDB installation script completed"