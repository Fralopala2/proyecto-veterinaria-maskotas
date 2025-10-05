# Users Table Setup Documentation

## Overview

This directory contains SQL scripts and setup utilities for creating the users table integrated with the MySQL world database for the MASK!OTAS veterinary clinic website.

## Files Description

### SQL Scripts

- **`create-users-table.sql`** - Creates the users table with foreign key constraints and indexes
- **`verify-users-table.sql`** - Verification script to check table structure and constraints
- **`insert-test-users.sql`** - Inserts sample test data for testing purposes
- **`setup-users-table-complete.sql`** - Complete setup script that combines all operations

### Setup Scripts

- **`setup-users-table.sh`** - Linux/Unix shell script for automated setup
- **`setup-users-table.ps1`** - Windows PowerShell script for automated setup

## Users Table Structure

The users table includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | INT AUTO_INCREMENT | Primary key |
| `username` | VARCHAR(50) | Unique username |
| `email` | VARCHAR(100) | Unique email address |
| `city_id` | INT | Foreign key to world.city.ID |
| `registration_date` | TIMESTAMP | Auto-generated registration timestamp |
| `connection_start` | TIMESTAMP | Session start time (nullable) |
| `connection_end` | TIMESTAMP | Session end time (nullable) |
| `last_connection_duration` | INT | Duration in minutes (nullable) |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record update timestamp |

## Foreign Key Constraints

- **`fk_users_city`**: References `world.city.ID` with RESTRICT on DELETE and CASCADE on UPDATE

## Indexes for Performance

- `idx_users_city_id` - Index on city_id for join performance
- `idx_users_registration_date` - Index on registration_date for date queries
- `idx_users_connection_start` - Index on connection_start for session queries
- `idx_users_email` - Index on email for unique constraint performance
- `idx_users_username` - Index on username for unique constraint performance
- `idx_users_connection_tracking` - Composite index on (city_id, connection_start, connection_end)

## Setup Instructions

### Prerequisites

1. MariaDB server installed and running
2. World database already restored (from previous setup steps)
3. Appropriate database permissions

### Quick Setup

**Linux/Unix:**
```bash
cd database-setup
./setup-users-table.sh
```

**Windows:**
```powershell
cd database-setup
.\setup-users-table.ps1
```

### Manual Setup

1. **Create the table:**
   ```bash
   sudo mysql < create-users-table.sql
   ```

2. **Verify the setup:**
   ```bash
   sudo mysql < verify-users-table.sql
   ```

3. **Insert test data:**
   ```bash
   sudo mysql < insert-test-users.sql
   ```

### Verification Commands

After setup, verify the table was created correctly:

```sql
USE world;
DESCRIBE users;
SHOW INDEX FROM users;
SELECT COUNT(*) FROM users;
```

## Test Data

The setup includes 11 test users from various cities around the world:

- Users from Amsterdam, New York, Tokyo, London, Paris, Madrid, Berlin, Rome
- Recent users with connection data for testing time-based queries
- All users have valid city_id references to the world database

## Integration Points

This users table integrates with:

1. **World Database**: Foreign key relationship with city table
2. **Connection Tracking**: Fields for session duration analysis
3. **Stored Procedures**: Data source for analytics procedures
4. **Website Forms**: Backend storage for user registrations

## Requirements Satisfied

- ✅ 2.1: Users table with city reference and connection tracking
- ✅ 2.2: City information references world database
- ✅ 2.3: Connection start/end timestamps included
- ✅ 2.4: Foreign key relationships with world database

## Next Steps

After completing this setup, you can proceed to:

1. Implement stored procedures (Task 5 & 6)
2. Create database connection utilities (Task 7)
3. Integrate with website forms (Task 8)
4. Implement connection tracking (Task 9)