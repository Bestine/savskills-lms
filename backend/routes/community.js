const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tribe = require('../models/Tribe');

// Get all tribes
router.get('/tribes', auth, async (req, res) => {
    try {
        const tribes = await Tribe.find().select('-messages');

        res.json({
            success: true,
            tribes: tribes.map(tribe => ({
                id: tribe.tribeId,
                name: tribe.name,
                description: tribe.description,
                members: tribe.members.length,
                color: tribe.color,
                resources: tribe.resources
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tribes'
        });
    }
});

// Join a tribe
router.post('/tribes/:tribeId/join', auth, async (req, res) => {
    try {
        const tribe = await Tribe.findOne({ tribeId: req.params.tribeId });

        if (!tribe) {
            return res.status(404).json({
                success: false,
                message: 'Tribe not found'
            });
        }

        // Check if already a member
        if (tribe.members.includes(req.userId)) {
            return res.json({
                success: true,
                message: 'Already a member',
                tribe
            });
        }

        // Add user to tribe
        tribe.members.push(req.userId);
        await tribe.save();

        // Update user
        req.user.tribe = tribe._id;
        await req.user.save();

        res.json({
            success: true,
            message: 'Joined tribe successfully',
            tribe
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error joining tribe'
        });
    }
});

// Get tribe messages
router.get('/tribes/:tribeId/messages', auth, async (req, res) => {
    try {
        const tribe = await Tribe.findOne({ tribeId: req.params.tribeId });

        if (!tribe) {
            return res.status(404).json({
                success: false,
                message: 'Tribe not found'
            });
        }

        res.json({
            success: true,
            messages: tribe.messages.slice(-50) // Last 50 messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching messages'
        });
    }
});

// Post message to tribe
router.post('/tribes/:tribeId/messages', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const tribe = await Tribe.findOne({ tribeId: req.params.tribeId });

        if (!tribe) {
            return res.status(404).json({
                success: false,
                message: 'Tribe not found'
            });
        }

        // Add message
        tribe.messages.push({
            user: req.userId,
            username: req.user.username,
            message,
            timestamp: new Date()
        });

        await tribe.save();

        res.json({
            success: true,
            message: 'Message posted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error posting message'
        });
    }
});

module.exports = router;
