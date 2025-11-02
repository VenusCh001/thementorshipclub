// Common Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // Not logged in, redirect to login page
            window.location.href = 'login.html';
            return;
        }

        // User is logged in, load their profile
        loadUserProfile(user);
    });

    // Load user profile data
    async function loadUserProfile(user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                
                // Update profile information
                document.getElementById('user-name').textContent = userData.fullName || 'User';
                document.getElementById('profile-name').textContent = userData.fullName || 'N/A';
                document.getElementById('profile-email').textContent = userData.email || user.email;
                
                // Format date
                if (userData.createdAt) {
                    const date = userData.createdAt.toDate();
                    document.getElementById('profile-date').textContent = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showMessage('error', 'Failed to load profile data');
        }
    }

    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and target section
            item.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Logout functionality
    const logoutButtons = document.querySelectorAll('#logout-button, #logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            auth.signOut()
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    alert('Failed to logout. Please try again.');
                });
        });
    });

    // Edit profile button (placeholder functionality)
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Edit profile functionality coming soon!');
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check for saved theme preference
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeToggle.classList.remove('fa-moon');
                themeToggle.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.classList.remove('fa-sun');
                themeToggle.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenu && mobileNav) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileNav.classList.toggle('active');
        });
    }

    // Dashboard sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');

    if (sidebarToggle && dashboardSidebar) {
        sidebarToggle.addEventListener('click', () => {
            dashboardSidebar.classList.toggle('active');
        });
    }
});

// Utility function to show messages
function showMessage(type, message) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Utility function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to get status badge HTML
function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'status-pending',
        'approved': 'status-approved',
        'rejected': 'status-rejected',
        'under-review': 'status-under-review'
    };
    
    const statusClass = statusClasses[status.toLowerCase()] || 'status-pending';
    return `<span class="status-badge ${statusClass}">${status}</span>`;
}