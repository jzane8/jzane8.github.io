// Main Express server configuration and startup
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const stateRoutes = require('./routes/state');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables at startup
const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

// Middleware
// Parse JSON request bodies
// https://expressjs.com/en/api.html#express.json
app.use(express.json({ limit: '1mb' }));

// Enable CORS for frontend requests
// Allows your React app to make requests to this API
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true  // Allow cookies/auth headers
}));

// Routes
app.use('/api/auth', authRoutes);    // Authentication endpoints
app.use('/api/state', stateRoutes);  // State management endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`);
});
