#!/bin/bash

# Script to make MariaDB configuration scripts executable
# Run this on the EC2 instance after uploading the scripts

echo "Making MariaDB configuration scripts executable..."

chmod +x check-max-connections.sh
chmod +x configure-max-connections.sh  
chmod +x restart-and-verify-mariadb.sh
chmod +x make-scripts-executable.sh

echo "✓ All scripts are now executable"
echo ""
echo "Available scripts:"
echo "- check-max-connections.sh      : Check current max_connections value"
echo "- configure-max-connections.sh  : Modify configuration file"
echo "- restart-and-verify-mariadb.sh : Restart service and verify changes"