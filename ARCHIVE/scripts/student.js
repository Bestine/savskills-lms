// Student Dashboard JavaScript
// Handles journal entries, cohort visualization, and interactive elements

// ============================================
// JOURNAL FUNCTIONALITY
// ============================================

// Word count for journal entry
const journalEntry = document.getElementById('journalEntry');
const wordCountDisplay = document.getElementById('wordCount');

if (journalEntry && wordCountDisplay) {
    journalEntry.addEventListener('input', function () {
        const text = this.value.trim();
        const words = text === '' ? 0 : text.split(/\s+/).length;
        wordCountDisplay.textContent = words;
    });
}

// Save draft function
function saveDraft() {
    const entry = document.getElementById('journalEntry').value;

    if (entry.trim() === '') {
        window.savskills.showNotification('Please write something before saving', 'warning');
        return;
    }

    // Save to localStorage
    const draft = {
        content: entry,
        timestamp: new Date().toISOString(),
        principle: 'Influence'
    };

    localStorage.setItem('journalDraft', JSON.stringify(draft));
    window.savskills.showNotification('Draft saved successfully!', 'success');
}

// Load draft on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedDraft = localStorage.getItem('journalDraft');
    if (savedDraft && journalEntry) {
        const draft = JSON.parse(savedDraft);
        const draftAge = Date.now() - new Date(draft.timestamp).getTime();

        // Only load draft if less than 24 hours old
        if (draftAge < 24 * 60 * 60 * 1000) {
            journalEntry.value = draft.content;
            journalEntry.dispatchEvent(new Event('input'));
        }
    }
});

// Handle journal form submission
const journalForm = document.getElementById('journalForm');
if (journalForm) {
    journalForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const entry = document.getElementById('journalEntry').value;

        if (entry.trim() === '') {
            window.savskills.showNotification('Please write a reflection before submitting', 'warning');
            return;
        }

        // Simulate submission
        const journalData = {
            id: window.savskills.generateId(),
            content: entry,
            principle: 'Influence',
            date: new Date().toISOString(),
            userId: window.savskills.getCurrentUser()?.email
        };

        // In a real app, this would be sent to the server
        console.log('Submitting journal entry:', journalData);

        // Clear draft and form
        localStorage.removeItem('journalDraft');
        document.getElementById('journalEntry').value = '';
        wordCountDisplay.textContent = '0';

        window.savskills.showNotification('Journal entry submitted successfully! 🎉', 'success');

        // Scroll to top after short delay
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
    });
}

// ============================================
// COHORT SPIDER WEB VISUALIZATION
// ============================================

function drawSpiderWeb() {
    const canvas = document.getElementById('spiderWebCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mock cohort data
    const students = [
        { name: 'Janan', x: centerX, y: centerY, color: '#D4AF37', isCenter: true },
        { name: 'Kwame', x: centerX + 120, y: centerY - 80, color: '#A8B5A1' },
        { name: 'Aisha', x: centerX - 100, y: centerY - 60, color: '#A8B5A1' },
        { name: 'Zara', x: centerX + 80, y: centerY + 90, color: '#A8B5A1' },
        { name: 'Malik', x: centerX - 130, y: centerY + 70, color: '#A8B5A1' },
        { name: 'Fatima', x: centerX + 150, y: centerY + 20, color: '#A8B5A1' },
        { name: 'Kofi', x: centerX - 80, y: centerY + 120, color: '#A8B5A1' },
        { name: 'Amara', x: centerX + 40, y: centerY - 130, color: '#A8B5A1' },
        { name: 'Jabari', x: centerX - 150, y: centerY - 20, color: '#A8B5A1' }
    ];

    // Draw connections (edges)
    ctx.strokeStyle = 'rgba(168, 181, 161, 0.2)';
    ctx.lineWidth = 1;

    students.forEach((student, i) => {
        if (!student.isCenter) {
            // Connect to center
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(student.x, student.y);
            ctx.stroke();

            // Connect to some neighbors
            if (i > 1 && i % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(student.x, student.y);
                ctx.lineTo(students[i - 1].x, students[i - 1].y);
                ctx.stroke();
            }
        }
    });

    // Draw nodes (students)
    students.forEach(student => {
        // Node circle
        ctx.beginPath();
        ctx.arc(student.x, student.y, student.isCenter ? 12 : 8, 0, 2 * Math.PI);
        ctx.fillStyle = student.color;
        ctx.fill();

        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#2C2C2C';
        ctx.font = student.isCenter ? 'bold 14px Inter' : '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(student.name, student.x, student.y + (student.isCenter ? 25 : 22));
    });
}

// Draw spider web on page load
document.addEventListener('DOMContentLoaded', drawSpiderWeb);

// Redraw on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawSpiderWeb, 250);
});

// ============================================
// SIDEBAR NAVIGATION
// ============================================

// Smooth scroll to sections
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();

            // Update active state
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Scroll to section
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Update active sidebar link on scroll
const sections = document.querySelectorAll('.dashboard-section');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
