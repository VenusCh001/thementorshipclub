document.addEventListener('DOMContentLoaded', () => {

    // === 1. FIREBASE INITIALIZATION ===
    // TODO: Paste your Firebase Configuration snippet here
    const firebaseConfig = {
        apiKey: "AIzaSyCBZ9ot3zHJ4fr5S0ABuSGad3xqfGRwvf4",
        authDomain: "tmc-test-d7cf3.firebaseapp.com",
        projectId: "tmc-test-d7cf3",
        storageBucket: "tmc-test-d7cf3.firebasestorage.app",
        messagingSenderId: "663210288673",
        appId: "1:663210288673:web:d50a3b1467370ca7ca2560"
    };
    // Initialize Firebase
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();


    // === 2. AUTH STATE LISTENER ===
    // This runs on every page load to check if the user is logged in
    // and updates the nav bar accordingly.

    const navLogin = document.getElementById('nav-li-login');
    const navSignup = document.getElementById('nav-li-signup');
    const navLogout = document.getElementById('nav-li-logout');
    const navProfile = document.getElementById('nav-li-profile');

    auth.onAuthStateChanged(user => {
        if (user) {
            // --- User is LOGGED IN ---
            // Hide "Login" and "Sign Up", Show "Profile"
            if (navLogin) navLogin.classList.add('nav-hidden');
            if (navSignup) navSignup.classList.add('nav-hidden');
            if (navLogout) navLogout.classList.add('nav-hidden'); // Hide logout button
            if (navProfile) navProfile.classList.remove('nav-hidden'); // Show profile icon

        } else {
            // --- User is LOGGED OUT ---
            // Show "Login" and "Sign Up", Hide "Logout"
            if (navLogin) navLogin.classList.remove('nav-hidden');
            if (navSignup) navSignup.classList.remove('nav-hidden');
            if (navLogout) navLogout.classList.add('nav-hidden'); // Keep logout hidden
            if (navProfile) navProfile.classList.add('nav-hidden'); // Hide profile icon
        }
    });

    // Dark/Light mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
            localStorage.removeItem('theme');
        }
    });

    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'dark-mode') {
        body.classList.add('dark-mode');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }
});
