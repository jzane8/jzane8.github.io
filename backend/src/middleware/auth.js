// JWT authentication middleware to protect routes
// Verifies that requests include a valid JWT token
const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT tokens
// This runs before protected route handlers to verify user identity
const authenticateToken = (req, res, next) => {
    // Extract token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Get token after "Bearer "
    
    if (!token) {
        // No token provided - user is not authenticated
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Verify token signature and expiration
    // jwt.verify() throws an error if token is invalid or expired
    // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        // Token is valid - attach user info to request object
        // This makes user data available to route handlers
        req.user = user;
        next();  // Continue to route handler
    });
};

module.exports = { authenticateToken };
