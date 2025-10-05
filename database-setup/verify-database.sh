#!/bin/bash

# Database Verification Commands Script
# This script implements the exact verification commands specified in requirements

echo "Starting database verification..."

# Create temporary SQL file for verification commands
VERIFY_SQL="/tmp/verify_commands.sql"

cat > $VERIFY_SQL << 'EOF'
-- Show all databases
SHOW DATABASES;

-- Use world database
USE world;

-- Show tables in world database
SHOW TABLES;

-- Select sample data from city table (limit 100 as specified)
SELECT * FROM city LIMIT 100;

-- Show current user grants
SHOW GRANTS;

-- Additional verification: count records in each table
SELECT 'city' as table_name, COUNT(*) as record_count FROM city
UNION ALL
SELECT 'country' as table_name, COUNT(*) as record_count FROM country
UNION ALL
SELECT 'countrylanguage' as table_name, COUNT(*) as record_count FROM countrylanguage;
EOF

echo "Executing verification commands..."

# Execute the verification commands
sudo mysql < $VERIFY_SQL

# Check if verification was successful
if [ $? -eq 0 ]; then
    echo "Database verification completed successfully"
else
    echo "ERROR: Database verification failed"
    exit 1
fi

# Additional verification: Check if world database exists and has expected tables
echo "Performing additional verification checks..."

# Check if world database exists
DB_EXISTS=$(sudo mysql -e "SHOW DATABASES LIKE 'world';" | grep world)
if [ -n "$DB_EXISTS" ]; then
    echo "✓ World database exists"
else
    echo "✗ World database not found"
    exit 1
fi

# Check if expected tables exist
TABLES_CHECK=$(sudo mysql -e "USE world; SHOW TABLES;" | grep -E "(city|country|countrylanguage)" | wc -l)
if [ "$TABLES_CHECK" -eq 3 ]; then
    echo "✓ All expected tables (city, country, countrylanguage) exist"
else
    echo "✗ Missing expected tables in world database"
    exit 1
fi

# Clean up temporary file
rm -f $VERIFY_SQL

echo "All database verification checks passed successfully"