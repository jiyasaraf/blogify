// blog-api/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

// CRITICAL: JWT Secret must be imported/defined from environment
const JWT_SECRET = process.env.JWT_SECRET || 'Default_JWT_SECRET'; 

/**
 * Middleware to check for a valid JWT token in the Authorization header.
 * Attaches the decoded user payload (userId, email) to req.user.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // 1. Check if header exists and is in "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Attach the decoded user payload to the request
        req.user = decoded; 
        next();
    } catch (err) {
        // 4. Handle token validation errors
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
