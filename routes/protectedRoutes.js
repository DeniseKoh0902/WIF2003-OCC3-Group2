const express = require('express');
const router = express.Router();
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware'); 

// Middleware to apply authentication to ALL routes in this router.
router.use((req, res, next) => {
    authMiddleware(req, res, (err) => {
        if (err) {
            if (req.accepts('html')) {
                return res.redirect('/login.html?redirect=' + encodeURIComponent(req.originalUrl));
            } else {
                return res.status(err.status || 401).json({ message: err.message || 'Authentication required.' });
            }
        }
        next();
    });
});

const privateFilesPath = path.join(__dirname, '..', 'frontend', 'private'); 
console.log('Serving protected static files from:', privateFilesPath); 
router.use(express.static(privateFilesPath));


module.exports = router;
