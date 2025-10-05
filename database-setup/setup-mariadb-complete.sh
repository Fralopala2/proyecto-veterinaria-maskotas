#!/bin/bash

# Complete MariaDB Environment Setup Script
# This script orchestrates the complete MariaDB setup following the exact steps specified

echo "=========================================="
echo "MASK!OTAS MariaDB Environment Setup"
echo "=========================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to check if script exists and is executable
check_script() {
    local script_path="$1"
    if [ ! -f "$script_path" ]; then
        echo "ERROR: Script not found: $script_path"
        exit 1
    fi
    chmod +x "$script_path"
}

# Make all scripts executable
echo "Preparing setup scripts..."
check_script "$SCRIPT_DIR/install-mariadb.sh"
check_script "$SCRIPT_DIR/start-mariadb-service.sh"
check_script "$SCRIPT_DIR/download-world-database.sh"
check_script "$SCRIPT_DIR/verify-database.sh"

echo "All scripts prepared successfully"
echo ""

# Step 1: Install MariaDB
echo "=========================================="
echo "STEP 1: Installing MariaDB Server"
echo "=========================================="
bash "$SCRIPT_DIR/install-mariadb.sh"
if [ $? -ne 0 ]; then
    echo "FATAL ERROR: MariaDB installation failed"
    exit 1
fi
echo ""

# Step 2: Start and Enable MariaDB Service
echo "=========================================="
echo "STEP 2: Starting MariaDB Service"
echo "=========================================="
bash "$SCRIPT_DIR/start-mariadb-service.sh"
if [ $? -ne 0 ]; then
    echo "FATAL ERROR: MariaDB service startup failed"
    exit 1
fi
echo ""

# Step 3: Download and Restore World Database
echo "=========================================="
echo "STEP 3: Setting up World Database"
echo "=========================================="
bash "$SCRIPT_DIR/download-world-database.sh"
if [ $? -ne 0 ]; then
    echo "FATAL ERROR: World database setup failed"
    exit 1
fi
echo ""

# Step 4: Verify Database Installation
echo "=========================================="
echo "STEP 4: Verifying Database Installation"
echo "=========================================="
bash "$SCRIPT_DIR/verify-database.sh"
if [ $? -ne 0 ]; then
    echo "FATAL ERROR: Database verification failed"
    exit 1
fi
echo ""

echo "=========================================="
echo "MariaDB Environment Setup COMPLETED"
echo "=========================================="
echo "✓ MariaDB server installed"
echo "✓ MariaDB service started and enabled"
echo "✓ World database downloaded and restored"
echo "✓ Database installation verified"
echo ""
echo "Next steps:"
echo "1. Run the max connections configuration script"
echo "2. Create the users table integration"
echo "3. Implement stored procedures"
echo "=========================================="