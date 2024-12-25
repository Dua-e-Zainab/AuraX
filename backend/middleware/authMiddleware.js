const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header Received:', authHeader);

    // Check if the authorization header exists and follows the "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid token format' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    console.log('Token Extracted:', token);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yo0aUAPPC6');
        console.log('Decoded Token Payload:', decoded);

        // Attach user data to the request
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };
