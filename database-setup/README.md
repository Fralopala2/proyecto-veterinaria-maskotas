# MariaDB Environment Setup Scripts

This directory contains scripts to set up the MariaDB environment for the MASK!OTAS veterinary clinic website following the exact steps specified in the requirements.

## Scripts Overview

### Individual Scripts

1. **install-mariadb.sh** - Installs MariaDB server using the exact command: `sudo yum install -y mariadb-server.x86_64`
2. **start-mariadb-service.sh** - Starts and enables MariaDB service using: `sudo systemctl start mariadb` and `sudo systemctl enable mariadb`
3. **download-world-database.sh** - Downloads and restores the world database using: `wget https://downloads.mysql.com/docs/world-db.zip`
4. **verify-database.sh** - Implements the exact verification commands specified in requirements

### Master Script

- **setup-mariadb-complete.sh** - Orchestrates all individual scripts in the correct order

## Usage

### Option 1: Run Complete Setup (Recommended)

```bash
# Make the master script executable and run it
chmod +x database-setup/setup-mariadb-complete.sh
./database-setup/setup-mariadb-complete.sh
```

### Option 2: Run Individual Scripts

```bash
# Step 1: Install MariaDB
chmod +x database-setup/install-mariadb.sh
./database-setup/install-mariadb.sh

# Step 2: Start MariaDB Service
chmod +x database-setup/start-mariadb-service.sh
./database-setup/start-mariadb-service.sh

# Step 3: Download and Restore World Database
chmod +x database-setup/download-world-database.sh
./database-setup/download-world-database.sh

# Step 4: Verify Installation
chmod +x database-setup/verify-database.sh
./database-setup/verify-database.sh
```

## Requirements Fulfilled

This implementation fulfills the following requirements:

- **Requirement 1.1**: Uses exact MariaDB installation command
- **Requirement 1.2**: Uses exact service startup commands
- **Requirement 1.3**: Uses exact world database download URL
- **Requirement 1.4**: Uses exact database restoration command
- **Requirement 1.5**: Implements exact verification commands

## Expected Output

After successful execution, you should have:

- MariaDB server installed and running
- World database with tables: city, country, countrylanguage
- Service enabled for automatic startup
- All verification commands passing

## Next Steps

After running these scripts, proceed to:
1. Configure max_connections setting (Task 3)
2. Create users table integration (Task 4)
3. Implement stored procedures (Tasks 5-6)

## Troubleshooting

If any script fails:
1. Check the error messages in the console output
2. Ensure you have sudo privileges
3. Verify internet connectivity for database download
4. Check that MariaDB service is running: `sudo systemctl status mariadb`
## 
Max Connections Configuration Scripts (Task 3)

### New Scripts for Max Connections Configuration

4. **check-max-connections.sh** - Check current max_connections value in MariaDB
5. **configure-max-connections.sh** - Modify `/etc/my.cnf.d/server.cnf` to set `max_connections = 10`
6. **restart-and-verify-mariadb.sh** - Restart MariaDB service and verify configuration changes
7. **make-scripts-executable.sh** - Make all scripts executable (run this first on EC2)

### Usage for Max Connections Configuration

```bash
# Step 1: Make all scripts executable
chmod +x database-setup/make-scripts-executable.sh
./database-setup/make-scripts-executable.sh

# Step 2: Check current max_connections setting
./database-setup/check-max-connections.sh

# Step 3: Configure max_connections to 10
./database-setup/configure-max-connections.sh

# Step 4: Restart MariaDB and verify changes
./database-setup/restart-and-verify-mariadb.sh
```

### Requirements Fulfilled (Task 3)

This implementation fulfills the following requirements:

- **Requirement 1.6**: Modifies `/etc/my.cnf.d/server.cnf` to set `max-connections = 10`
- **Requirement 1.7**: Restarts MariaDB service and verifies configuration changes take effect

### Expected Output for Max Connections Configuration

After successful execution, you should have:

- MariaDB configured with `max_connections = 10`
- Configuration file `/etc/my.cnf.d/server.cnf` properly modified
- MariaDB service restarted with new configuration
- Verification showing `max_connections` is set to 10