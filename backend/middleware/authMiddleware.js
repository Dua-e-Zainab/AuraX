const jwt = require('jsonwebtoken');

// Middleware to check token validity
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        console.log('Token missing or invalid');
        return res.status(401).json({ message: 'Token is missing or invalid' });
    }

    jwt.verify(token, 'yo0aUAPPC6', (err, user) => {
        if (err) {
            console.log('Invalid token');
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Pass user data to the next middleware
        next();
    });
};



module.exports = authenticateToken;  // Export the middleware
