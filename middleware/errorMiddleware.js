// Handle application errors
const errorMiddleware = (err, req, res, next) => {
    // Get status code or use 500 as default
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Send error response
    res.status(statusCode).json({
        message: err.message || "Internal server error"
    });
};

// Export error middleware
export default errorMiddleware;