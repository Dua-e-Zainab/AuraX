// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];  // Token comes after 'Bearer'

    // If token is not provided
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded user info to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Handle any errors that occur during token verification
        res.status(400).json({ message: 'Invalid Token', error: err.message });
    }
};

module.exports = authenticateToken;
