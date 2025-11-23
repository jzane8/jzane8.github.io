// Database connection configuration using mysql2
// This creates a connection pool for efficient database operations
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to handle multiple concurrent database requests
// A pool is more efficient than creating new connections for each query
// https://github.com/sidorares/node-mysql2#using-connection-pools
const pool = mysql.createPool({
    host: process.env.DB_HOST,           // Database server address
    user: process.env.DB_USER,           // Database username
    password: process.env.DB_PASSWORD,   // Database password
    database: process.env.DB_NAME,       // Database name
    waitForConnections: true,            // Queue requests when no connections available
    connectionLimit: 10,                 // Maximum number of connections in pool
    queueLimit: 0                        // Unlimited queued connection requests
});

// Test database connection on startup
pool.getConnection()
    .then(connection => {
        console.log('✓ Database connected successfully');
        connection.release();  // Return connection to pool
    })
    .catch(err => {
        console.error('✗ Database connection failed:', err.message);
        process.exit(1);  // Exit if database connection fails
    });

module.exports = pool;
