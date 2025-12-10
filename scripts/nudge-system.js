// Achievement Nudge System
// Inspired by NudgeNow's gamification and in-app nudge patterns

// ============================================
// ACHIEVEMENT DEFINITIONS
// ============================================

const achievements = {
    journalStreak: {
        id: 'journal_streak',
        title: '🔥 Journal Streak',
        levels: [
            { days: 3, badge: '3-Day Streak', points: 10, message: 'Great start! You\'ve journaled for 3 days straight!' },
            { days: 7, badge: 'Week Warrior', points: 25, message: 'Amazing! A full week of reflection shows true commitment!' },
            { days: 14, badge: 'Fortnight Force', points: 50, message: 'Incredible! Two weeks of consistent growth!' },
            { days: 30, badge: 'Monthly Master', points: 100, message: 'Legendary! 30 days of journaling - you\'re unstoppable!' }
        ]
    },
    qualityReflection: {
        id: 'quality_reflection',
        title: '✨ Deep Thinker',
        levels: [
            { count: 1, badge: 'Thoughtful', points: 15, message: 'Your reflection showed profound insight!' },
            { count: 5, badge: 'Philosopher', points: 40, message: 'Five deep reflections! You\'re truly engaging with the material!' },
            { count: 10, badge: 'Wisdom Seeker', points: 75, message: 'Ten profound entries! Your growth is inspiring!' }
        ]
    },
    cohortEngagement: {
        id: 'cohort_engagement',
        title: '🤝 Community Builder',
        levels: [
            { connections: 5, badge: 'Connector', points: 20, message: 'You\'ve connected with 5 cohort members!' },
            { connections: 10, badge: 'Networker', points: 40, message: 'Double digits! Your network is growing strong!' },
            { connections: 20, badge: 'Community Leader', points: 80, message: 'You\'re a pillar of this cohort!' }
        ]
    },
    courseProgress: {
        id: 'course_progress',
        title: '📚 Learning Champion',
        levels: [
            { percent: 25, badge: 'Quarter Complete', points: 30, message: 'You\'re 25% through the journey!' },
            { percent: 50, badge: 'Halfway Hero', points: 60, message: 'Halfway there! The transformation is real!' },
            { percent: 75, badge: 'Almost There', points: 90, message: '75% complete - the finish line is in sight!' },
            { percent: 100, badge: 'Graduate', points: 150, message: 'Congratulations! You\'ve completed the course!' }
        ]
    }
};

// ============================================
// NUDGE MESSAGES
// ============================================

const nudgeMessages = {
    encouragement: [
        {
            trigger: 'no_journal_2_days',
            title: 'We Miss Your Reflections! 💭',
            message: 'It\'s been 2 days since your last journal entry. Your insights are valuable - take 5 minutes to reflect today!',
            cta: 'Write Entry',
            icon: '📝',
            type: 'reminder'
        },
        {
            trigger: 'journal_quality_drop',
            title: 'Let\'s Go Deeper 🌊',
            message: 'Your recent entries have been shorter. Challenge yourself to explore your thoughts more fully today!',
            cta: 'Write Reflection',
            icon: '💡',
            type: 'motivation'
        },
        {
            trigger: 'low_cohort_engagement',
            title: 'Your Cohort Needs You! 👥',
            message: 'Connect with your fellow leaders. Check out recent insights from Kwame and Fatima!',
            cta: 'View Cohort',
            icon: '🤝',
            type: 'social'
        }
    ],
    celebrations: [
        {
            trigger: 'achievement_unlocked',
            title: '🎉 Achievement Unlocked!',
            type: 'celebration',
            showConfetti: true
        },
        {
            trigger: 'milestone_reached',
            title: '🏆 Milestone Reached!',
            type: 'celebration',
            showConfetti: true
        },
        {
            trigger: 'streak_maintained',
            title: '🔥 Streak Alive!',
            type: 'celebration',
            showConfetti: false
        }
    ],
    progress: [
        {
            trigger: 'weekly_recap',
            title: 'Your Week in Review 📊',
            type: 'progress',
            showStats: true
        }
    ]
};

// ============================================
// NUDGE DISPLAY SYSTEM
// ============================================

class AchievementNudgeSystem {
    constructor() {
        this.currentUser = window.savskills.getCurrentUser();
        this.achievements = this.loadAchievements();
        this.totalPoints = this.calculateTotalPoints();
    }

    loadAchievements() {
        const stored = localStorage.getItem(`achievements_${this.currentUser?.email}`);
        return stored ? JSON.parse(stored) : {
            journalStreak: 0,
            qualityReflections: 0,
            cohortConnections: 0,
            courseProgress: 0,
            unlockedBadges: [],
            totalPoints: 0,
            lastJournalDate: null
        };
    }

    saveAchievements() {
        localStorage.setItem(`achievements_${this.currentUser?.email}`, JSON.stringify(this.achievements));
    }

    calculateTotalPoints() {
        return this.achievements.totalPoints || 0;
    }

    checkAndShowNudges() {
        // Check for missed journal entries
        const lastJournal = this.achievements.lastJournalDate;
        if (lastJournal) {
            const daysSince = Math.floor((Date.now() - new Date(lastJournal).getTime()) / (1000 * 60 * 60 * 24));
            if (daysSince >= 2) {
                this.showNudge(nudgeMessages.encouragement[0]);
            }
        }

        // Show achievement progress
        this.showProgressCard();
    }

    showNudge(nudge) {
        const nudgeElement = document.createElement('div');
        nudgeElement.className = 'achievement-nudge animate-slide-in';
        nudgeElement.innerHTML = `
      <div class="nudge-icon">${nudge.icon}</div>
      <div class="nudge-content">
        <h4>${nudge.title}</h4>
        <p>${nudge.message}</p>
      </div>
      <button class="btn btn-primary btn-sm nudge-cta">${nudge.cta}</button>
      <button class="nudge-close" onclick="this.closest('.achievement-nudge').remove()">×</button>
    `;

        document.body.appendChild(nudgeElement);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            nudgeElement.style.opacity = '0';
            setTimeout(() => nudgeElement.remove(), 300);
        }, 10000);
    }

    unlockAchievement(achievementType, level) {
        const achievement = achievements[achievementType];
        if (!achievement) return;

        const levelData = achievement.levels[level];
        if (!levelData) return;

        // Add points
        this.achievements.totalPoints = (this.achievements.totalPoints || 0) + levelData.points;

        // Add badge
        if (!this.achievements.unlockedBadges.includes(levelData.badge)) {
            this.achievements.unlockedBadges.push(levelData.badge);
            this.saveAchievements();

            // Show celebration
            this.showCelebration(achievement.title, levelData);
        }
    }

    showCelebration(title, levelData) {
        // Create confetti effect
        this.triggerConfetti();

        // Show achievement modal
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
      <div class="achievement-modal-content animate-scale-in">
        <div class="achievement-celebration">
          <div class="achievement-icon">🎉</div>
          <h2>Achievement Unlocked!</h2>
          <div class="achievement-badge">
            <div class="badge-circle">${title}</div>
            <h3>${levelData.badge}</h3>
          </div>
          <p class="achievement-message">${levelData.message}</p>
          <div class="achievement-points">
            <span class="points-earned">+${levelData.points}</span>
            <span class="points-label">Points</span>
          </div>
          <button class="btn btn-primary" onclick="this.closest('.achievement-modal').remove()">
            Awesome! 🚀
          </button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Play sound effect (optional)
        this.playAchievementSound();
    }

    triggerConfetti() {
        // Simple confetti animation
        const colors = ['#D4AF37', '#A8B5A1', '#C87855', '#8EA9B8'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }
    }

    playAchievementSound() {
        // Create a simple success sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    showProgressCard() {
        const progressCard = document.getElementById('achievementProgress');
        if (!progressCard) return;

        const nextMilestone = this.getNextMilestone();

        progressCard.innerHTML = `
      <div class="progress-header">
        <h4>Your Progress</h4>
        <div class="total-points">
          <span class="points-value">${this.achievements.totalPoints}</span>
          <span class="points-label">Points</span>
        </div>
      </div>
      
      <div class="badges-earned">
        <h5>Badges Earned (${this.achievements.unlockedBadges.length})</h5>
        <div class="badge-list">
          ${this.achievements.unlockedBadges.map(badge => `
            <div class="mini-badge" title="${badge}">${badge}</div>
          `).join('') || '<p class="text-muted">Complete activities to earn badges!</p>'}
        </div>
      </div>
      
      ${nextMilestone ? `
        <div class="next-milestone">
          <h5>Next Milestone</h5>
          <p>${nextMilestone.description}</p>
          <div class="milestone-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${nextMilestone.progress}%"></div>
            </div>
            <span class="progress-text">${nextMilestone.progress}%</span>
          </div>
        </div>
      ` : ''}
    `;
    }

    getNextMilestone() {
        // Calculate next achievement based on current progress
        const journalStreak = this.achievements.journalStreak || 3;
        const nextLevel = achievements.journalStreak.levels.find(l => l.days > journalStreak);

        if (nextLevel) {
            return {
                description: `Journal for ${nextLevel.days} days to unlock "${nextLevel.badge}"`,
                progress: Math.min(100, (journalStreak / nextLevel.days) * 100)
            };
        }

        return null;
    }

    // Simulate journal entry and trigger achievement
    onJournalSubmit() {
        const today = new Date().toDateString();
        const lastJournal = this.achievements.lastJournalDate;

        // Update streak
        if (lastJournal) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
            if (lastJournal === yesterday) {
                this.achievements.journalStreak = (this.achievements.journalStreak || 0) + 1;
            } else if (lastJournal !== today) {
                this.achievements.journalStreak = 1; // Reset streak
            }
        } else {
            this.achievements.journalStreak = 1;
        }

        this.achievements.lastJournalDate = today;

        // Check for streak achievements
        const streak = this.achievements.journalStreak;
        const streakLevel = achievements.journalStreak.levels.findIndex(l => l.days === streak);

        if (streakLevel !== -1) {
            this.unlockAchievement('journalStreak', streakLevel);
        }

        this.saveAchievements();
        this.showProgressCard();
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

let nudgeSystem;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('journalForm')) {
        nudgeSystem = new AchievementNudgeSystem();
        nudgeSystem.checkAndShowNudges();

        // Hook into journal submission
        const originalSubmit = document.getElementById('journalForm').onsubmit;
        document.getElementById('journalForm').addEventListener('submit', function (e) {
            e.preventDefault();

            // Process journal
            nudgeSystem.onJournalSubmit();

            // Show success nudge
            window.savskills.showNotification('Journal entry submitted! Keep up the great work! 🎉', 'success');

            // Clear form
            this.reset();
            document.getElementById('wordCount').textContent = '0';
        });
    }
});

// Make available globally
window.nudgeSystem = nudgeSystem;
