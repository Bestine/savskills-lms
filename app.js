// ============================================
// Savskill Platform - Main Application Logic
// ============================================

// State Management
const AppState = {
    currentPage: 'loading-screen',
    currentUser: null,
    currentAssessment: {},
    currentCourse: null,
    currentModule: null,
    currentTribe: null,
    assessmentAnswers: [],
    currentQuestionIndex: 0
};

// Sample Course Data
const coursesData = [
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
                    },
                    {
                        question: 'Which of these is NOT a component of active listening?',
                        options: [
                            'Pay full attention',
                            'Interrupt with solutions',
                            'Provide feedback',
                            'Defer judgment'
                        ],
                        correct: 1
                    }
                ]
            },
            {
                id: 'comm-2',
                number: 2,
                name: 'Clear Expression',
                content: `
                    <h3>The Power of Clarity</h3>
                    <p>Clear expression is about conveying your thoughts, ideas, and expectations in a way that is easily understood by others. As a leader, this skill is crucial for effective delegation, motivation, and vision-sharing.</p>
                `,
                videoUrl: 'https://example.com/video2.mp4',
                quiz: []
            },
            {
                id: 'comm-3',
                number: 3,
                name: 'Non-Verbal Communication',
                content: `
                    <h3>Beyond Words</h3>
                    <p>Research shows that up to 93% of communication effectiveness is determined by non-verbal cues. Understanding and mastering body language, facial expressions, and tone of voice is essential for leadership.</p>
                `,
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

// Assessment Questions
const assessmentQuestions = [
    // Communication Questions
    {
        category: 'communication',
        question: 'How comfortable are you leading team meetings and presentations?',
        options: [
            'Very uncomfortable - I avoid it when possible',
            'Somewhat uncomfortable - I do it when required',
            'Comfortable - I can lead meetings effectively',
            'Very comfortable - I excel at public speaking and presentations'
        ]
    },
    {
        category: 'communication',
        question: 'How well do you listen to your team members\' concerns?',
        options: [
            'I often miss important details',
            'I listen but sometimes get distracted',
            'I actively listen and respond appropriately',
            'I practice active listening and always acknowledge concerns'
        ]
    },
    {
        category: 'communication',
        question: 'How clear and concise is your written communication?',
        options: [
            'Often unclear or too lengthy',
            'Sometimes confusing',
            'Generally clear and concise',
            'Always clear, concise, and well-structured'
        ]
    },
    {
        category: 'communication',
        question: 'How do you handle giving constructive feedback?',
        options: [
            'I avoid giving feedback',
            'I give feedback but struggle with delivery',
            'I can give constructive feedback when needed',
            'I excel at providing actionable, constructive feedback'
        ]
    },
    // Conflict Resolution Questions
    {
        category: 'conflictResolution',
        question: 'When team members disagree, how do you typically respond?',
        options: [
            'I avoid getting involved',
            'I choose sides or impose a solution',
            'I mediate and help find common ground',
            'I facilitate collaborative problem-solving and win-win solutions'
        ]
    },
    {
        category: 'conflictResolution',
        question: 'How do you handle your own emotions during conflicts?',
        options: [
            'I often react emotionally',
            'I struggle to stay calm',
            'I usually maintain composure',
            'I remain calm and use emotions constructively'
        ]
    },
    {
        category: 'conflictResolution',
        question: 'How well can you identify the root cause of conflicts?',
        options: [
            'I focus on surface-level issues',
            'I sometimes identify underlying issues',
            'I usually find the root cause',
            'I excel at uncovering and addressing root causes'
        ]
    },
    {
        category: 'conflictResolution',
        question: 'How comfortable are you with difficult conversations?',
        options: [
            'Very uncomfortable - I avoid them',
            'Uncomfortable but I handle them when necessary',
            'Comfortable - I can navigate difficult discussions',
            'Very comfortable - I see them as growth opportunities'
        ]
    },
    // Relationship Building Questions
    {
        category: 'relationshipBuilding',
        question: 'How well do you build trust with your team members?',
        options: [
            'I struggle to build trust',
            'Trust builds slowly with my team',
            'I build trust effectively',
            'I excel at quickly building strong, trusting relationships'
        ]
    },
    {
        category: 'relationshipBuilding',
        question: 'How empathetic are you towards your team\'s challenges?',
        options: [
            'I focus on results over feelings',
            'I acknowledge feelings but prioritize tasks',
            'I balance empathy with productivity',
            'I deeply understand and support team members emotionally'
        ]
    },
    {
        category: 'relationshipBuilding',
        question: 'How actively do you network and build professional connections?',
        options: [
            'I rarely network',
            'I network occasionally',
            'I actively build my network',
            'I consistently expand and nurture my professional network'
        ]
    },
    {
        category: 'relationshipBuilding',
        question: 'How well do you celebrate team successes?',
        options: [
            'I rarely acknowledge achievements',
            'I mention successes when they occur',
            'I regularly celebrate team wins',
            'I actively create celebration moments and recognize contributions'
        ]
    }
];

// Tribe Data
const tribesData = [
    {
        id: 'visionaries',
        name: 'The Visionaries',
        description: 'Strategic thinkers focused on big-picture leadership and innovation. Perfect for those who excel in planning and inspiring others toward ambitious goals.',
        members: 248,
        activeChats: 12,
        color: '#6366f1',
        messages: [
            {
                user: 'Sarah M.',
                avatar: 'S',
                message: 'Just finished the Strategic Planning module. The framework is amazing!',
                time: '2 hours ago'
            }
        ],
        resources: [
            { title: 'Vision Board Template', type: 'Document' },
            { title: '5-Year Planning Guide', type: 'PDF' }
        ]
    },
    {
        id: 'connectors',
        name: 'The Connectors',
        description: 'Relationship builders who excel at networking and creating strong team bonds. Ideal for those who prioritize people and collaboration.',
        members: 312,
        activeChats: 18,
        color: '#06b6d4',
        messages: [],
        resources: [
            { title: 'Networking Tips', type: 'Video' },
            { title: 'Team Building Activities', type: 'Document' }
        ]
    },
    {
        id: 'mediators',
        name: 'The Mediators',
        description: 'Conflict resolution specialists who create harmony and facilitate difficult conversations. Great for those skilled in diplomacy and problem-solving.',
        members: 189,
        activeChats: 9,
        color: '#8b5cf6',
        messages: [],
        resources: [
            { title: 'Conflict Resolution Framework', type: 'PDF' },
            { title: 'Mediation Case Studies', type: 'Document' }
        ]
    },
    {
        id: 'achievers',
        name: 'The Achievers',
        description: 'Results-driven leaders focused on execution and goal achievement. Perfect for those who excel at driving performance and delivering outcomes.',
        members: 276,
        activeChats: 15,
        color: '#f59e0b',
        messages: [],
        resources: [
            { title: 'Goal Setting Framework', type: 'Document' },
            { title: 'Performance Metrics Guide', type: 'PDF' }
        ]
    }
];

// Weekly Challenges
const weeklyChallenge = {
    current: {
        title: 'Active Listening Challenge',
        description: 'Practice active listening in your next three conversations. Focus on: 1) Maintaining eye contact, 2) Not interrupting, 3) Paraphrasing to confirm understanding. After each conversation, reflect on what you learned and how the other person responded.',
        category: 'Communication',
        deadline: '5 days',
        tasks: [
            'Have three meaningful conversations',
            'Practice active listening techniques',
            'Journal your reflections',
            'Share insights with your tribe'
        ]
    },
    past: [
        {
            title: 'Feedback Friday',
            description: 'Give constructive feedback to three team members',
            status: 'completed',
            completedDate: '2 weeks ago'
        },
        {
            title: 'Conflict Resolution Role-Play',
            description: 'Practice mediating a simulated workplace conflict',
            status: 'completed',
            completedDate: '3 weeks ago'
        }
    ]
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    startLoadingSequence();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('savskillUser');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
    }
}

function setupEventListeners() {
    // Welcome page
    document.getElementById('join-btn')?.addEventListener('click', () => {
        navigateTo('auth-page');
    });

    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchAuthTab(tab);
        });
    });

    // Login form
    document.getElementById('login-form-element')?.addEventListener('submit', handleLogin);

    // Signup form
    document.getElementById('signup-form-element')?.addEventListener('submit', handleSignup);

    // Assessment navigation
    document.getElementById('next-question')?.addEventListener('click', nextQuestion);
    document.getElementById('prev-question')?.addEventListener('click', prevQuestion);
    document.getElementById('submit-assessment')?.addEventListener('click', submitAssessment);

    // Dashboard navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            navigateToDashboardSection(page);
        });
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

    // Course navigation
    document.getElementById('back-to-courses')?.addEventListener('click', () => {
        document.getElementById('course-detail').style.display = 'none';
        document.getElementById('courses-grid').parentElement.style.display = 'block';
    });

    document.getElementById('back-to-modules')?.addEventListener('click', () => {
        document.getElementById('module-view').style.display = 'none';
        document.getElementById('course-detail').style.display = 'block';
    });

    // Module tabs
    document.querySelectorAll('.module-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchModuleTab(e.target.dataset.tab);
        });
    });

    // Bot features
    document.querySelectorAll('.bot-feature-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const feature = e.currentTarget.dataset.feature;
            switchBotFeature(feature);
        });
    });

    // Bot chat
    document.getElementById('send-chat')?.addEventListener('click', sendChatMessage);
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // Feedback form
    document.getElementById('feedback-form')?.addEventListener('submit', handleFeedbackSubmit);

    // Community navigation
    document.getElementById('back-to-tribes')?.addEventListener('click', () => {
        document.getElementById('tribe-chat').style.display = 'none';
        document.getElementById('tribe-selection').style.display = 'block';
    });

    // Tribe chat
    document.getElementById('send-tribe-message')?.addEventListener('click', sendTribeMessage);
    document.getElementById('tribe-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendTribeMessage();
    });
}

// ============================================
// Loading Sequence
// ============================================

function startLoadingSequence() {
    setTimeout(() => {
        navigateTo('welcome-page');
    }, 4000);
}

// ============================================
// Navigation
// ============================================

function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageId;
    }
}

function navigateToDashboardSection(sectionId) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');

    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// ============================================
// Authentication
// ============================================

function switchAuthTab(tab) {
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simple validation (in production, this would be server-side)
    const savedUser = localStorage.getItem('savskillUser');

    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email === email) {
            AppState.currentUser = user;
            loadDashboard();
            navigateTo('dashboard-page');
            return;
        }
    }

    alert('Invalid credentials. Please sign up first or check your email/password.');
}

function handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-password-confirm').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Create new user (in production, this would involve backend API)
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        enrolledCourses: ['communication', 'conflict', 'relationships'],
        completedModules: [],
        assessmentScores: null,
        tier: null,
        createdAt: new Date().toISOString()
    };

    AppState.currentUser = newUser;

    // Show assessment
    navigateTo('assessment-page');
    loadAssessment();
}

function handleLogout() {
    AppState.currentUser = null;
    localStorage.removeItem('savskillUser');
    navigateTo('welcome-page');
}

// ============================================
// Assessment
// ============================================

function loadAssessment() {
    const questionsContainer = document.querySelector('.assessment-questions');
    questionsContainer.innerHTML = '';

    assessmentQuestions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        if (index === 0) questionCard.classList.add('active');

        questionCard.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${q.question}</p>
            <div class="options">
                ${q.options.map((option, optIndex) => `
                    <div class="option">
                        <input type="radio" name="q${index}" id="q${index}-opt${optIndex}" value="${optIndex}" />
                        <label for="q${index}-opt${optIndex}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;

        questionsContainer.appendChild(questionCard);
    });

    AppState.currentQuestionIndex = 0;
    updateQuestionProgress();
}

function nextQuestion() {
    const currentQuestion = document.querySelectorAll('.question-card')[AppState.currentQuestionIndex];
    const selected = currentQuestion.querySelector('input[type="radio"]:checked');

    if (!selected) {
        alert('Please select an answer before proceeding');
        return;
    }

    // Save answer
    AppState.assessmentAnswers[AppState.currentQuestionIndex] = parseInt(selected.value);

    if (AppState.currentQuestionIndex < assessmentQuestions.length - 1) {
        currentQuestion.classList.remove('active');
        AppState.currentQuestionIndex++;
        document.querySelectorAll('.question-card')[AppState.currentQuestionIndex].classList.add('active');
        updateQuestionProgress();
    }

    // Show submit button on last question
    if (AppState.currentQuestionIndex === assessmentQuestions.length - 1) {
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('submit-assessment').style.display = 'block';
    }

    // Enable prev button
    document.getElementById('prev-question').disabled = false;
}

function prevQuestion() {
    if (AppState.currentQuestionIndex > 0) {
        document.querySelectorAll('.question-card')[AppState.currentQuestionIndex].classList.remove('active');
        AppState.currentQuestionIndex--;
        document.querySelectorAll('.question-card')[AppState.currentQuestionIndex].classList.add('active');
        updateQuestionProgress();

        // Hide submit, show next
        document.getElementById('next-question').style.display = 'block';
        document.getElementById('submit-assessment').style.display = 'none';
    }

    if (AppState.currentQuestionIndex === 0) {
        document.getElementById('prev-question').disabled = true;
    }
}

function updateQuestionProgress() {
    document.querySelector('.current-question').textContent = AppState.currentQuestionIndex + 1;
    document.querySelector('.total-questions').textContent = assessmentQuestions.length;
}

function submitAssessment() {
    // Calculate scores
    const scores = {
        communication: 0,
        conflictResolution: 0,
        relationshipBuilding: 0
    };

    assessmentQuestions.forEach((q, index) => {
        const answer = AppState.assessmentAnswers[index] || 0;
        scores[q.category] += answer;
    });

    // Determine tier based on overall score
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = assessmentQuestions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    let tier;
    if (percentage >= 75) tier = 'Achievers';
    else if (percentage >= 50) tier = 'Visionaries';
    else if (percentage >= 25) tier = 'Connectors';
    else tier = 'Mediators';

    // Save to user
    AppState.currentUser.assessmentScores = scores;
    AppState.currentUser.tier = tier;
    localStorage.setItem('savskillUser', JSON.stringify(AppState.currentUser));

    // Navigate to dashboard
    navigateTo('dashboard-page');
    loadDashboard();
}

// ============================================
// Dashboard
// ============================================

function loadDashboard() {
    const user = AppState.currentUser;

    // Update user info
    document.getElementById('dashboard-username').textContent = user.username;
    document.getElementById('user-avatar').textContent = user.username.charAt(0).toUpperCase();

    // Update stats
    document.getElementById('enrolled-courses').textContent = user.enrolledCourses?.length || 3;
    document.getElementById('completed-modules').textContent = user.completedModules?.length || 0;
    document.getElementById('current-streak').textContent = Math.floor(Math.random() * 15) + 1;
    document.getElementById('user-tier').textContent = user.tier || 'Explorer';

    // Load courses
    loadCourses();

    // Load bot features
    loadBotNudges();
    loadFeedbackModules();

    // Load community
    loadTribes();

    // Load challenge
    loadWeeklyChallenge();

    // Load activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    const activities = [
        { text: 'Completed "Active Listening" module', time: '2 hours ago' },
        { text: 'Joined The Visionaries tribe', time: '1 day ago' },
        { text: 'Started Communication course', time: '3 days ago' }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <p>${activity.text}</p>
            <span class="time">${activity.time}</span>
        </div>
    `).join('');
}

// ============================================
// Courses
// ============================================

function loadCourses() {
    const coursesGrid = document.getElementById('courses-grid');
    const userCourses = coursesData.filter(course =>
        AppState.currentUser.enrolledCourses?.includes(course.id)
    );

    coursesGrid.innerHTML = userCourses.map(course => `
        <div class="course-card" data-course-id="${course.id}">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-progress">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${course.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', () => {
            const courseId = card.dataset.courseId;
            showCourseDetail(courseId);
        });
    });
}

function showCourseDetail(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    AppState.currentCourse = course;

    document.getElementById('courses-grid').parentElement.style.display = 'none';
    const detailView = document.getElementById('course-detail');
    detailView.style.display = 'block';

    document.getElementById('course-title').textContent = course.title;

    const modulesGrid = document.getElementById('modules-grid');
    modulesGrid.innerHTML = course.modules.map(module => `
        <div class="module-box ${isModuleCompleted(module.id) ? 'completed' : ''}" data-module-id="${module.id}">
            <div class="module-number">${module.number}</div>
            <div class="module-name">${module.name}</div>
        </div>
    `).join('');

    // Add module click handlers
    document.querySelectorAll('.module-box').forEach(box => {
        box.addEventListener('click', () => {
            const moduleId = box.dataset.moduleId;
            showModuleView(moduleId);
        });
    });
}

function showModuleView(moduleId) {
    const module = AppState.currentCourse.modules.find(m => m.id === moduleId);
    AppState.currentModule = module;

    document.getElementById('course-detail').style.display = 'none';
    const moduleView = document.getElementById('module-view');
    moduleView.style.display = 'block';

    document.getElementById('module-title').textContent = module.name;
    document.getElementById('content-text').innerHTML = module.content;

    // Load quiz if available
    if (module.quiz && module.quiz.length > 0) {
        loadModuleQuiz(module.quiz);
    }
}

function switchModuleTab(tabName) {
    document.querySelectorAll('.module-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    document.querySelectorAll('.module-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function loadModuleQuiz(quiz) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = quiz.map((q, index) => `
        <div class="quiz-question">
            <h4>Question ${index + 1}: ${q.question}</h4>
            <div class="quiz-options">
                ${q.options.map((option, optIndex) => `
                    <div class="quiz-option" data-question="${index}" data-option="${optIndex}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const questionIndex = parseInt(e.target.dataset.question);
            const optionIndex = parseInt(e.target.dataset.option);
            const question = quiz[questionIndex];

            // Remove previous selection
            document.querySelectorAll(`[data-question="${questionIndex}"]`).forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });

            // Mark selection
            e.target.classList.add('selected');

            // Show if correct
            if (optionIndex === question.correct) {
                e.target.classList.add('correct');

                // Mark module as completed
                if (!AppState.currentUser.completedModules.includes(AppState.currentModule.id)) {
                    AppState.currentUser.completedModules.push(AppState.currentModule.id);
                    localStorage.setItem('savskillUser', JSON.stringify(AppState.currentUser));
                }
            } else {
                e.target.classList.add('incorrect');
                // Highlight correct answer
                document.querySelector(`[data-question="${questionIndex}"][data-option="${question.correct}"]`).classList.add('correct');
            }
        });
    });
}

function isModuleCompleted(moduleId) {
    return AppState.currentUser.completedModules?.includes(moduleId) || false;
}

// ============================================
// Bot Features
// ============================================

function switchBotFeature(feature) {
    document.querySelectorAll('.bot-feature-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.bot-feature').forEach(feat => {
        feat.classList.remove('active');
    });
    document.getElementById(`bot-${feature}`).classList.add('active');
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    const chatMessages = document.getElementById('chat-messages');

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `
        <div class="message-content"><p>${message}</p></div>
        <div class="message-avatar">${AppState.currentUser.username.charAt(0).toUpperCase()}</div>
    `;
    chatMessages.appendChild(userMessage);

    // Clear input
    input.value = '';

    // Simulate AI response (in production, this would call OpenAI API)
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content"><p>${botResponse}</p></div>
        `;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = [
        "That's a great question about leadership! Based on the modules you've completed, I recommend focusing on practical application. Try implementing what you've learned in your next team meeting.",
        "Active listening is one of the most powerful leadership skills. Have you tried the technique from Module 1 where you paraphrase what the other person said before responding?",
        "I notice you're making excellent progress in the Communication course! Would you like to take on this week's challenge to practice these skills in real situations?",
        "Leadership is all about continuous growth. Based on your assessment, relationship building is one of your strengths. Have you considered joining The Connectors tribe to network with like-minded leaders?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function loadBotNudges() {
    const nudgesList = document.getElementById('nudges-list');
    const nudges = [
        {
            title: 'Practice Active Listening',
            description: 'You completed the Active Listening module yesterday. Try applying these techniques in your next conversation and reflect on the outcome.',
            time: '2 hours ago'
        },
        {
            title: 'Weekly Challenge Reminder',
            description: 'Don\'t forget to complete this week\'s Active Listening Challenge. You have 5 days remaining!',
            time: '1 day ago'
        },
        {
            title: 'Share Your Progress',
            description: 'You\'ve completed 3 modules! Share your learning journey with your tribe to inspire others.',
            time: '2 days ago'
        }
    ];

    nudgesList.innerHTML = nudges.map(nudge => `
        <div class="nudge-item">
            <h4>${nudge.title}</h4>
            <p>${nudge.description}</p>
            <div class="nudge-time">${nudge.time}</div>
        </div>
    `).join('');
}

function loadFeedbackModules() {
    const feedbackModule = document.getElementById('feedback-module');
    const modules = AppState.currentCourse?.modules || coursesData[0].modules;

    feedbackModule.innerHTML = '<option value="">Select a module</option>' +
        modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
}

function handleFeedbackSubmit(e) {
    e.preventDefault();

    const moduleId = document.getElementById('feedback-module').value;
    const feedbackText = document.getElementById('feedback-text').value;

    if (!moduleId || !feedbackText) {
        alert('Please select a module and provide feedback');
        return;
    }

    // In production, this would send to backend
    alert('Thank you for your feedback! We appreciate your input and will use it to improve the platform.');

    // Clear form
    document.getElementById('feedback-form').reset();
}

// ============================================
// Community/Tribes
// ============================================

function loadTribes() {
    const tribesGrid = document.getElementById('tribes-grid');
    tribesGrid.innerHTML = tribesData.map(tribe => `
        <div class="tribe-card" data-tribe-id="${tribe.id}">
            <h3>${tribe.name}</h3>
            <p>${tribe.description}</p>
            <div class="tribe-stats">
                <div class="tribe-stat">
                    <span>👥</span> ${tribe.members} members
                </div>
                <div class="tribe-stat">
                    <span>💬</span> ${tribe.activeChats} active chats
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.tribe-card').forEach(card => {
        card.addEventListener('click', () => {
            const tribeId = card.dataset.tribeId;
            joinTribe(tribeId);
        });
    });
}

function joinTribe(tribeId) {
    const tribe = tribesData.find(t => t.id === tribeId);
    AppState.currentTribe = tribe;

    document.getElementById('tribe-selection').style.display = 'none';
    document.getElementById('tribe-chat').style.display = 'block';

    document.getElementById('current-tribe-name').textContent = tribe.name;
    document.getElementById('tribe-member-count').textContent = `${tribe.members} members`;

    // Load tribe messages
    const tribeMessages = document.getElementById('tribe-messages');
    if (tribe.messages.length > 0) {
        tribeMessages.innerHTML = tribe.messages.map(msg => `
            <div class="bot-message">
                <div class="message-avatar">${msg.avatar}</div>
                <div class="message-content">
                    <strong>${msg.user}</strong>
                    <p>${msg.message}</p>
                    <span class="time">${msg.time}</span>
                </div>
            </div>
        `).join('');
    } else {
        tribeMessages.innerHTML = `
            <div class="bot-message">
                <div class="message-avatar">🎉</div>
                <div class="message-content">
                    <p>Welcome to ${tribe.name}! Be the first to start a conversation.</p>
                </div>
            </div>
        `;
    }

    // Load resources
    const resourcesList = document.getElementById('tribe-resources');
    resourcesList.innerHTML = tribe.resources.map(resource => `
        <div class="resource-item">
            <h4>${resource.title}</h4>
            <p>${resource.type}</p>
        </div>
    `).join('');
}

function sendTribeMessage() {
    const input = document.getElementById('tribe-input');
    const message = input.value.trim();

    if (!message) return;

    const tribeMessages = document.getElementById('tribe-messages');
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <strong>${AppState.currentUser.username}</strong>
            <p>${message}</p>
            <span class="time">Just now</span>
        </div>
        <div class="message-avatar">${AppState.currentUser.username.charAt(0).toUpperCase()}</div>
    `;
    tribeMessages.appendChild(userMessage);

    input.value = '';
    tribeMessages.scrollTop = tribeMessages.scrollHeight;
}

// ============================================
// Weekly Challenge
// ============================================

function loadWeeklyChallenge() {
    const challengeCard = document.getElementById('current-challenge-card');
    const challenge = weeklyChallenge.current;

    challengeCard.innerHTML = `
        <h3>${challenge.title}</h3>
        <p>${challenge.description}</p>
        <div class="challenge-tasks" style="margin: 1.5rem 0;">
            <h4 style="margin-bottom: 1rem;">Tasks:</h4>
            <ul style="list-style: none; padding: 0;">
                ${challenge.tasks.map(task => `
                    <li style="padding: 0.5rem 0; color: var(--text-secondary);">✓ ${task}</li>
                `).join('')}
            </ul>
        </div>
        <div class="challenge-actions">
            <button class="challenge-btn">Mark as Complete</button>
        </div>
    `;

    // Load past challenges
    const pastChallengesList = document.getElementById('past-challenges-list');
    pastChallengesList.innerHTML = weeklyChallenge.past.map(challenge => `
        <div class="past-challenge-item">
            <div>
                <h4>${challenge.title}</h4>
                <p>${challenge.description}</p>
                <p>Completed ${challenge.completedDate}</p>
            </div>
            <span class="challenge-status completed">Completed</span>
        </div>
    `).join('');
}

// ============================================
// Utility Functions
// ============================================

console.log('Savskill Platform Initialized ✓');
