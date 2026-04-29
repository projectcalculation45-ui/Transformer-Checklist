const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation');
const { successResponse, errorResponse } = require('../utils/response');
const { authenticate, invalidateToken } = require('../middlewares/auth');
const userService = require('../services/user.service');
const logger = require('../utils/logger');

const router = express.Router();

const IS_PROD = process.env.NODE_ENV === 'production';
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || (IS_PROD ? 'None' : 'Strict');

// Cookie options — HttpOnly prevents JS access (XSS protection)
// SameSite: None is required in production for cross-site auth requests
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: IS_PROD,
    maxAge: 8 * 60 * 60 * 1000 // 8 hours in ms (matches JWT_EXPIRY)
};

/**
 * POST /auth/login
 * Authenticate user credentials, set HttpOnly JWT cookie
 */
router.post('/login', [
    body('userId').optional().trim(),
    body('username').optional().trim(),
    body('password').trim().notEmpty().withMessage('Password is required')
], handleValidationErrors, async (req, res) => {
    const loginKey = (req.body.userId || req.body.username || '').trim();
    const password = req.body.password;

    if (!loginKey) {
        return res.status(400).json(errorResponse('User ID is required'));
    }

    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`🔐 [AUTH] Login attempt for user: "${loginKey}"`);
            console.log('🔐 [AUTH] Request body:', { loginKey, password: password ? '*****' : null });
        }

        const user = await userService.findByUserIdWithPassword(loginKey);

        if (!user) {
            logger.warn(`Login attempt for non-existent user: "${loginKey}"`);
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            logger.warn(`Password mismatch for user: "${loginKey}"`);
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        logger.info(`Login successful for user: "${loginKey}"`);

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '8h' }
        );

        // Set token as HttpOnly cookie — JS cannot read this (XSS-safe)
        res.cookie('authToken', token, COOKIE_OPTIONS);

        // Return user info only — raw token NEVER sent to client
        res.json(successResponse({
            user: {
                userId: user.userId,
                name: user.name,
                role: user.role,
                department: user.department || null,
                customerId: user.customerId || null,
                customerName: user.customerName || null,
                email: user.email,
                permissions: user.permissions || []
            }
        }, 'Login successful'));

    } catch (error) {
        logger.error('Auth error:', error);
        res.status(500).json(errorResponse('Authentication failed'));
    }
});

/**
 * POST /auth/logout
 * Clear the HttpOnly auth cookie and blacklist the JWT
 */
router.post('/logout', authenticate, (req, res) => {
    let token = req.cookies && req.cookies.authToken;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (token) {
        invalidateToken(token);
        logger.info('Token invalidated on logout');
    }

    res.clearCookie('authToken', {
        httpOnly: true,
        sameSite: COOKIE_SAME_SITE,
        secure: IS_PROD
    });
    res.json(successResponse(null, 'Logged out successfully'));
});

module.exports = router;
