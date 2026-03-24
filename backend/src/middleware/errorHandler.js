// Global error handling middleware
// Catches errors from route handlers and formats consistent error responses
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Determine appropriate status code
    // Default to 500 (Internal Server Error) if not specified
    const statusCode = err.statusCode || 500;
    
    // Send formatted error response
    const isDev = process.env.NODE_ENV === 'development';
    res.status(statusCode).json({
        error: isDev ? (err.message || 'Internal server error') : 'Internal server error',
        ...(isDev && { stack: err.stack })
    });
};

module.exports = errorHandler;
