// Authentication controller handles user registration and login
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register a new user
// Hashes password and stores user in database
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        // Check if username already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        
        // Hash password using bcrypt
        // Salt rounds of 10 provides good security/performance balance
        // https://github.com/kelektiv/node.bcrypt.js#usage
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Insert new user into database
        const [result] = await db.query(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );
        
        const userId = result.insertId;
        
        // Generate JWT token for immediate login after registration
        // Token contains user ID and username
        const token = jwt.sign(
            { userId, username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { userId, username }
        });
        
    } catch (error) {
        next(error);  // Pass error to error handler middleware
    }
};

// Login existing user
// Verifies credentials and returns JWT token
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        // Find user by username
        const [users] = await db.query(
            'SELECT id, username, password_hash FROM users WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Compare provided password with stored hash
        // bcrypt.compare() handles the hashing and comparison securely
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: { userId: user.id, username: user.username }
        });
        
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
