const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

// Signup
router.post('/signup', [
    body('username').trim().isLength({ min: 3, max: 30 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create new user
        const user = new User({
            username,
            email,
            password,
            verificationToken,
            enrolledCourses: ['communication', 'conflict', 'relationships']
        });

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please verify your email.',
            token,
            user: user.toPublicJSON()
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last active date
        user.lastActiveDate = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            token,
            user: user.toPublicJSON()
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// Verify email
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email'
        });
    }
});

module.exports = router;
