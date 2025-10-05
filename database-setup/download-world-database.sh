#!/bin/bash

# World Database Download and Restoration Script
# This script downloads and restores the MySQL world database as specified

echo "Starting world database download and restoration..."

# Create temporary directory for database files
TEMP_DIR="/tmp/world-db-setup"
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Download the world database using exact URL from requirements
echo "Downloading world database..."
wget https://downloads.mysql.com/docs/world-db.zip

# Check if download was successful
if [ $? -eq 0 ]; then
    echo "World database downloaded successfully"
else
    echo "ERROR: Failed to download world database"
    exit 1
fi

# Extract the downloaded zip file
echo "Extracting world database..."
unzip world-db.zip

# Check if extraction was successful
if [ $? -eq 0 ]; then
    echo "World database extracted successfully"
    ls -la world-db/
else
    echo "ERROR: Failed to extract world database"
    exit 1
fi

# Restore the database using exact command from requirements
echo "Restoring world database to MariaDB..."
sudo mysql < world-db/world.sql

# Check if restoration was successful
if [ $? -eq 0 ]; then
    echo "World database restored successfully"
else
    echo "ERROR: Failed to restore world database"
    exit 1
fi

# Clean up temporary files
echo "Cleaning up temporary files..."
cd /
rm -rf $TEMP_DIR

echo "World database download and restoration completed"