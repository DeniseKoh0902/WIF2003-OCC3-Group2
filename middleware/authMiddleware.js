const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.Authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authorization is denied. Please log into your account.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();

    } catch (err) {
        console.error('Auth middleware error:', err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        } else {
            return res.status(500).json({ message: 'Server error during token verification.' });
        }
    }
};

module.exports = authMiddleware;