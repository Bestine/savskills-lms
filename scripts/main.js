// Main JavaScript for SavSkills Platform
// Handles navigation, authentication simulation, and global utilities

// ============================================
// NAVIGATION
// ============================================

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
      if (navMenu.classList.contains('active')) {
        if (index === 0) span.style.transform = 'rotate(45deg) translateY(10px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-10px)';
      } else {
        span.style.transform = '';
        span.style.opacity = '';
      }
    });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    }
  });
});

// ============================================
// AUTHENTICATION SIMULATION
// ============================================

// Mock user data
const mockUsers = {
  student: {
    email: 'student@savskills.com',
    password: 'student123',
    role: 'student',
    name: 'Janan Odhiambo',
    dashboardUrl: 'student/dashboard.html'
  },
  admin: {
    email: 'admin@savskills.com',
    password: 'admin123',
    role: 'admin',
    name: 'David Mutua',
    dashboardUrl: 'admin/dashboard.html'
  },
  alumni: {
    email: 'alumni@savskills.com',
    password: 'alumni123',
    role: 'alumni',
    name: 'Aisha Okonkwo',
    dashboardUrl: 'alumni/dashboard.html'
  }
};

// Login function
function login(email, password) {
  // Find matching user
  const user = Object.values(mockUsers).find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    // Store user session
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  
  return { success: false, error: 'Invalid email or password' };
}

// Logout function
function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}

// Get current user
function getCurrentUser() {
  const userData = sessionStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Check if user is authenticated
function isAuthenticated() {
  return getCurrentUser() !== null;
}

// Protect page (redirect to login if not authenticated)
function requireAuth(allowedRoles = []) {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '../auth/login.html';
    return false;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    alert('You do not have permission to access this page');
    window.location.href = '../index.html';
    return false;
  }
  
  return true;
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type} animate-slide-in`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? 'var(--color-success)' : 
                        type === 'error' ? 'var(--color-error)' : 
                        type === 'warning' ? 'var(--color-warning)' : 
                        'var(--color-info)'};
    color: white;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-tooltip);
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate random ID
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Debounce function for search/filter
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// INTERSECTION OBSERVER (Scroll Animations)
// ============================================

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in, .animate-scale-in');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = el.classList.contains('animate-slide-in') ? 'translateX(-30px)' : 'translateY(20px)';
    observer.observe(el);
  });
});

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

// Make functions globally available
window.savskills = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  requireAuth,
  showNotification,
  formatDate,
  generateId,
  debounce,
  mockUsers
};
