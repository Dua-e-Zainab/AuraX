const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from 'Authorization' header

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token, authentication failed.' });
    }
};

module.exports = authMiddleware;
