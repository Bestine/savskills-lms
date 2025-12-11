const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user.toPublicJSON()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username } = req.body;
        const user = req.user;

        if (username) {
            // Check if username is already taken
            const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
            user.username = username;
        }

        await user.save();

        res.json({
            success: true,
            user: user.toPublicJSON()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

// Submit assessment
router.post('/assessment', auth, async (req, res) => {
    try {
        const { scores } = req.body;
        const user = req.user;

        if (!scores) {
            return res.status(400).json({
                success: false,
                message: 'Assessment scores are required'
            });
        }

        // Update scores
        user.assessmentScores = scores;

        // Determine tier
        const totalScore = scores.communication + scores.conflictResolution + scores.relationshipBuilding;
        const maxScore = 36; // 12 questions * 3 points max
        const percentage = (totalScore / maxScore) * 100;

        if (percentage >= 75) user.tier = 'Achievers';
        else if (percentage >= 50) user.tier = 'Visionaries';
        else if (percentage >= 25) user.tier = 'Connectors';
        else user.tier = 'Mediators';

        await user.save();

        res.json({
            success: true,
            user: user.toPublicJSON()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving assessment'
        });
    }
});

// Update course progress
router.post('/progress', auth, async (req, res) => {
    try {
        const { moduleId } = req.body;
        const user = req.user;

        if (!moduleId) {
            return res.status(400).json({
                success: false,
                message: 'Module ID is required'
            });
        }

        // Check if module already completed
        const alreadyCompleted = user.completedModules.some(m => m.moduleId === moduleId);

        if (!alreadyCompleted) {
            user.completedModules.push({
                moduleId,
                completedAt: new Date()
            });
            await user.save();
        }

        res.json({
            success: true,
            user: user.toPublicJSON()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating progress'
        });
    }
});

module.exports = router;
