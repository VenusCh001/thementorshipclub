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
});
// Improved Preloader: minimum visible time + graceful removal
(function () {
  const MIN_VISIBLE_MS = 1200; // minimum time preloader stays visible
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const now = Date.now();
  let loadedAt = null;

  window.addEventListener('load', () => {
    loadedAt = Date.now();
    const elapsed = loadedAt - now;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    // After wait, start fade out
    setTimeout(() => {
      preloader.classList.add('preloader-hidden');

      // Wait for CSS transition to finish, then remove element
      const onTransitionEnd = (e) => {
        if (e.propertyName === 'opacity') {
          preloader.removeEventListener('transitionend', onTransitionEnd);
          // remove from DOM so it can't affect layout at all
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }
      };
      preloader.addEventListener('transitionend', onTransitionEnd);

      // Fallback: if transitionend doesn't fire, remove after 1000ms
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 1000 + 600);
    }, wait);
  });
})();
