document.addEventListener('DOMContentLoaded', () => {

    // === 1. FIREBASE INITIALIZATION ===
    // TODO: Paste your Firebase Configuration snippet here
    const firebaseConfig = {
        apiKey: "AIzaSyCn2doe6FIkQa72fqxS3sUztVBlGMELjPU",
        authDomain: "the-mentorship-club.firebaseapp.com",
        projectId: "the-mentorship-club",
        storageBucket: "the-mentorship-club.firebasestorage.app",
        messagingSenderId: "751166513169",
        appId: "1:751166513169:web:fe846f547d51bb6fc591b0",
        measurementId: "G-4KPYJYTL71"
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

    auth.onAuthStateChanged(user => {
        if (user) {
            // --- User is LOGGED IN ---
            // Hide "Login" and "Sign Up", Show "Logout"
            if (navLogin) navLogin.classList.add('nav-hidden');
            if (navSignup) navSignup.classList.add('nav-hidden');
            if (navLogout) navLogout.classList.remove('nav-hidden');

        } else {
            // --- User is LOGGED OUT ---
            // Show "Login" and "Sign Up", Hide "Logout"
            if (navLogin) navLogin.classList.remove('nav-hidden');
            if (navSignup) navSignup.classList.remove('nav-hidden');
            if (navLogout) navLogout.classList.add('nav-hidden');
        }
    });


    // === 3. LOGOUT BUTTON LOGIC ===
    // This adds the click event to the "Logout" button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                // Sign-out successful.
                // The onAuthStateChanged listener will automatically update the nav.
                // We'll just redirect to home.
                console.log('User signed out.');
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        });
    }

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
