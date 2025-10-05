# Easy Level Stored Procedures Documentation

## Overview

This document describes the two easy level stored procedures created for the MASK!OTAS veterinary clinic database integration. These procedures provide basic user analytics by leveraging the integration between the users table and the MySQL world database.

## Stored Procedures

### 1. SP_UsersByCountryAndCity

**Purpose:** For each country, show which cities have registered users and how many from each city.

**Parameters:** None

**Returns:**
- `country_name` (VARCHAR): Name of the country
- `city_name` (VARCHAR): Name of the city within that country
- `user_count` (INT): Number of registered users from that city

**Usage:**
```sql
CALL SP_UsersByCountryAndCity();
```

**Example Output:**
```
+---------------+-------------+------------+
| country_name  | city_name   | user_count |
+---------------+-------------+------------+
| France        | Paris       |          1 |
| Germany       | Berlin      |          1 |
| Japan         | Tokyo       |          2 |
| Netherlands   | Amsterdam   |          2 |
| Spain         | Madrid      |          1 |
| United Kingdom| London      |          1 |
| United States | New York    |          2 |
+---------------+-------------+------------+
```

**Business Logic:**
- Groups users by country and city
- Orders results by country name alphabetically
- Within each country, orders cities by user count (descending) then city name (ascending)
- Only shows countries and cities that have registered users

### 2. SP_CountryWithMostUsers

**Purpose:** Identify which country has the highest number of users and return the exact count.

**Parameters:** None

**Returns:**
- `country_name` (VARCHAR): Name of the country with most users
- `user_count` (INT): Total number of users from that country

**Usage:**
```sql
CALL SP_CountryWithMostUsers();
```

**Example Output:**
```
+---------------+------------+
| country_name  | user_count |
+---------------+------------+
| United States |          3 |
+---------------+------------+
```

**Business Logic:**
- Counts total users per country
- Returns only the country with the highest count
- In case of ties, returns one of the tied countries (MySQL behavior)

## Technical Implementation

### Database Integration
Both procedures leverage the foreign key relationship between:
- `users.city_id` → `city.ID`
- `city.CountryCode` → `country.Code`

### Error Handling
- Both procedures include `SQLEXCEPTION` handlers
- Automatic rollback on errors
- Error re-signaling for proper error propagation

### Performance Considerations
- Uses INNER JOINs for optimal performance
- Leverages existing indexes on foreign key columns
- Efficient GROUP BY operations

## Installation and Testing

### Installation
```bash
# Create the stored procedures
sudo mysql < database-setup/create-easy-stored-procedures.sql
```

### Testing
```bash
# Run comprehensive tests
sudo mysql < database-setup/test-easy-stored-procedures.sql
```

### Manual Testing
```sql
-- Connect to database
sudo mysql

-- Use world database
USE world;

-- Test first procedure
CALL SP_UsersByCountryAndCity();

-- Test second procedure
CALL SP_CountryWithMostUsers();

-- Verify procedures exist
SHOW PROCEDURE STATUS WHERE Db = 'world';
```

## Requirements Satisfied

- ✅ **3.1**: Returns for each country which cities have registered users and how many from each city
- ✅ **3.2**: Identifies which country has the most users and returns the exact count
- ✅ **3.3**: Uses the world database city and country tables for geographic data
- ✅ **3.4**: Shows country name, city name, and user counts in a clear format

## Integration with Website

These procedures can be called from the PHP backend to populate:
- User distribution analytics dashboard
- Geographic user statistics
- Country-based user insights
- City-level user analytics

## Next Steps

After implementing these easy level procedures, you can:
1. Integrate them into the admin dashboard (Task 10)
2. Proceed to difficult level procedures (Task 6)
3. Add more test data for comprehensive testing (Task 11)
4. Implement website integration (Task 8)