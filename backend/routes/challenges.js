const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample weekly challenge data
const currentChallenge = {
    id: 'challenge-1',
    title: 'Active Listening Challenge',
    description: 'Practice active listening in your next three conversations. Focus on: 1) Maintaining eye contact, 2) Not interrupting, 3) Paraphrasing to confirm understanding.',
    category: 'Communication',
    daysRemaining: 5,
    tasks: [
        'Have three meaningful conversations',
        'Practice active listening techniques',
        'Journal your reflections',
        'Share insights with your tribe'
    ]
};

// Get current challenge
router.get('/current', auth, (req, res) => {
    res.json({
        success: true,
        challenge: currentChallenge
    });
});

// Mark challenge as complete
router.post('/complete/:challengeId', auth, async (req, res) => {
    try {
        // In production, save to database
        console.log(`User ${req.user.username} completed challenge ${req.params.challengeId}`);

        res.json({
            success: true,
            message: 'Challenge marked as complete'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error completing challenge'
        });
    }
});

module.exports = router;
