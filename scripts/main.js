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
});
