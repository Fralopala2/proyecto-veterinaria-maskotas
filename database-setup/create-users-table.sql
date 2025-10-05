-- Create users table integrated with world database
-- This script creates the users table with foreign key reference to the world database city table
-- Includes connection tracking fields and performance indexes

USE world;

-- Create users table with city_id foreign key and connection tracking
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    city_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    connection_start TIMESTAMP NULL,
    connection_end TIMESTAMP NULL,
    last_connection_duration INT NULL COMMENT 'Duration in minutes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint to world database city table
    CONSTRAINT fk_users_city 
        FOREIGN KEY (city_id) REFERENCES city(ID) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_city_id ON users(city_id);
CREATE INDEX idx_users_registration_date ON users(registration_date);
CREATE INDEX idx_users_connection_start ON users(connection_start);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Create composite index for connection tracking queries
CREATE INDEX idx_users_connection_tracking ON users(city_id, connection_start, connection_end);

SHOW CREATE TABLE users;