const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Chat with bot
router.post('/chat', auth, async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        const user = req.user;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Build context about user's progress
        const userContext = `
The user ${user.username} is working on leadership development.
Their tier: ${user.tier}
Assessment scores:
- Communication: ${user.assessmentScores.communication}
- Conflict Resolution: ${user.assessmentScores.conflictResolution}
- Relationship Building: ${user.assessmentScores.relationshipBuilding}
Completed modules: ${user.completedModules.length}

You are a supportive AI leadership coach. Provide practical, actionable advice based on their progress.
        `.trim();

        // Prepare messages for OpenAI
        const messages = [
            {
                role: 'system',
                content: userContext
            },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user',
                content: message
            }
        ];

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
        });

        const botResponse = completion.choices[0].message.content;

        res.json({
            success: true,
            response: botResponse,
            conversationHistory: [
                ...conversationHistory,
                { role: 'user', content: message },
                { role: 'assistant', content: botResponse }
            ]
        });

    } catch (error) {
        console.error('Bot chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing chat',
            error: error.message
        });
    }
});

// Generate nudges based on user progress
router.get('/nudges', auth, async (req, res) => {
    try {
        const user = req.user;
        const nudges = [];

        // Check recent module completions
        const recentModules = user.completedModules.slice(-3);
        if (recentModules.length > 0) {
            nudges.push({
                title: 'Practice What You Learned',
                description: `You recently completed modules on leadership skills. Try applying these concepts in your next team interaction.`,
                type: 'practice',
                priority: 'high'
            });
        }

        // Check assessment scores for weak areas
        const scores = user.assessmentScores;
        const weakestArea = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
        if (weakestArea[1] < 6) {
            const areaNames = {
                communication: 'Communication',
                conflictResolution: 'Conflict Resolution',
                relationshipBuilding: 'Relationship Building'
            };
            nudges.push({
                title: `Focus on ${areaNames[weakestArea[0]]}`,
                description: `Your assessment shows room for growth in ${areaNames[weakestArea[0]]}. Consider spending extra time on related modules.`,
                type: 'recommendation',
                priority: 'medium'
            });
        }

        // Weekly challenge reminder
        nudges.push({
            title: 'Weekly Challenge Available',
            description: 'A new leadership challenge is waiting for you. Complete it to practice real-world skills!',
            type: 'challenge',
            priority: 'medium'
        });

        res.json({
            success: true,
            nudges
        });

    } catch (error) {
        console.error('Nudges error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating nudges'
        });
    }
});

// Submit feedback
router.post('/feedback', auth, async (req, res) => {
    try {
        const { moduleId, feedbackText } = req.body;
        const user = req.user;

        if (!moduleId || !feedbackText) {
            return res.status(400).json({
                success: false,
                message: 'Module ID and feedback text are required'
            });
        }

        // In production, save to Feedback model
        console.log(`Feedback from ${user.username} on module ${moduleId}: ${feedbackText}`);

        res.json({
            success: true,
            message: 'Feedback submitted successfully'
        });

    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback'
        });
    }
});

module.exports = router;
