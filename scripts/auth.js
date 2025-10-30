document.addEventListener('DOMContentLoaded', () => {


    const firebaseConfig = {
        apiKey: "AIzaSyBh1QDVmc7DTKt2KX6wtfipA8OOf2QUYC8",
        authDomain: "thementorshipclub.firebaseapp.com",
        projectId: "thementorshipclub",
        storageBucket: "thementorshipclub.firebasestorage.app",
        messagingSenderId: "947641206696",
        appId: "1:947641206696:web:21d9b154ec2d5a84547f9d",
        measurementId: "G-Z20P0RQZ1W"
    };

    // Initialize Firebase
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    // --- Login Form Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            console.log('Attempting login with:', email);

            // TODO: Add your Firebase Login Logic here
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    console.log('User logged in:', userCredential.user);
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Login Error:', error);
                    alert('Error: ' + error.message);
                });
            
        });
    }

    // --- Sign Up Form Logic ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            console.log('Attempting sign up with:', email);

            // TODO: Add your Firebase Sign Up Logic here
            
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    console.log('User created:', userCredential.user);
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Sign Up Error:', error);
                    alert('Error: ' + error.message);
                });
            
        });
    }

});