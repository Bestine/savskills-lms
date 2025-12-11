// Sample course data for the platform
module.exports = [
    {
        id: 'communication',
        title: 'Effective Communication',
        description: 'Master the art of clear, impactful communication in leadership',
        progress: 35,
        modules: [
            {
                id: 'comm-1',
                number: 1,
                name: 'Active Listening',
                content: `
                    <h3>Understanding Active Listening</h3>
                    <p>Active listening is a fundamental skill for effective leaders. It goes beyond simply hearing words – it involves fully concentrating, understanding, responding, and remembering what is being said.</p>
                    
                    <h3>Key Components</h3>
                    <p><strong>1. Pay Full Attention:</strong> Give the speaker your undivided attention and acknowledge their message.</p>
                    <p><strong>2. Show That You're Listening:</strong> Use body language and gestures to convey attention.</p>
                    <p><strong>3. Provide Feedback:</strong> Reflect on what has been said by paraphrasing.</p>
                    <p><strong>4. Defer Judgment:</strong> Allow the speaker to finish each point before asking questions.</p>
                    <p><strong>5. Respond Appropriately:</strong> Be candid, open, and honest in your response.</p>
                    
                    <h3>Benefits in Leadership</h3>
                    <p>Active listening builds trust, prevents misunderstandings, and creates an environment where team members feel valued and heard. This leads to better collaboration and improved team morale.</p>
                `,
                videoUrl: 'https://example.com/video1.mp4',
                quiz: [
                    {
                        question: 'What is the primary goal of active listening?',
                        options: [
                            'To formulate your response',
                            'To fully understand the speaker\'s message',
                            'To appear interested',
                            'To finish the conversation quickly'
                        ],
                        correct: 1
                    }
                ]
            },
            {
                id: 'comm-2',
                number: 2,
                name: 'Clear Expression',
                content: '<h3>The Power of Clarity</h3><p>Clear expression is about conveying your thoughts, ideas, and expectations in a way that is easily understood by others.</p>',
                videoUrl: 'https://example.com/video2.mp4',
                quiz: []
            },
            {
                id: 'comm-3',
                number: 3,
                name: 'Non-Verbal Communication',
                content: '<h3>Beyond Words</h3><p>Research shows that up to 93% of communication effectiveness is determined by non-verbal cues.</p>',
                videoUrl: 'https://example.com/video3.mp4',
                quiz: []
            }
        ]
    },
    {
        id: 'conflict',
        title: 'Conflict Resolution',
        description: 'Learn to navigate and resolve conflicts constructively',
        progress: 10,
        modules: [
            {
                id: 'conf-1',
                number: 1,
                name: 'Understanding Conflict',
                content: '<h3>Types of Conflict</h3><p>Learn to identify different types of workplace conflicts...</p>',
                videoUrl: 'https://example.com/conflict1.mp4',
                quiz: []
            },
            {
                id: 'conf-2',
                number: 2,
                name: 'Mediation Strategies',
                content: '<h3>Effective Mediation</h3><p>Discover proven strategies for mediating conflicts...</p>',
                videoUrl: 'https://example.com/conflict2.mp4',
                quiz: []
            }
        ]
    },
    {
        id: 'relationships',
        title: 'Relationship Building',
        description: 'Build strong, authentic relationships with your team',
        progress: 60,
        modules: [
            {
                id: 'rel-1',
                number: 1,
                name: 'Trust Foundation',
                content: '<h3>Building Trust</h3><p>Trust is the foundation of all strong relationships...</p>',
                videoUrl: 'https://example.com/rel1.mp4',
                quiz: []
            },
            {
                id: 'rel-2',
                number: 2,
                name: 'Empathy & Understanding',
                content: '<h3>Developing Empathy</h3><p>Empathy allows you to connect with others on a deeper level...</p>',
                videoUrl: 'https://example.com/rel2.mp4',
                quiz: []
            },
            {
                id: 'rel-3',
                number: 3,
                name: 'Networking Skills',
                content: '<h3>Strategic Networking</h3><p>Build a powerful professional network...</p>',
                videoUrl: 'https://example.com/rel3.mp4',
                quiz: []
            }
        ]
    }
];
