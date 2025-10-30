document.addEventListener('DOMContentLoaded', () => {

    // Get the auth service from the main.js-initialized app
    // This will work as long as main.js is loaded first
    const auth = firebase.auth();

    // --- Login Form Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const successMsg = document.getElementById('success-message');
        const errorMsg = document.getElementById('error-message');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Hide messages on new submit
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Firebase Login Logic
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Show success message
                    errorMsg.style.display = 'none';
                    successMsg.textContent = 'Login successful! Redirecting to home...';
                    successMsg.style.display = 'block';

                    // Redirect after a delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000); // 2-second delay
                })
                .catch((error) => {
                    // Show error message
                    successMsg.style.display = 'none';
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = 'block';
                });
        });
    }

    // --- Sign Up Form Logic ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const successMsg = document.getElementById('success-message');
        const errorMsg = document.getElementById('error-message');

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            // Hide messages on new submit
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Firebase Sign Up Logic
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Show success message
                    errorMsg.style.display = 'none';
                    successMsg.textContent = 'Sign up successful! Redirecting to home...';
                    successMsg.style.display = 'block';

                    // Redirect after a delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000); // 2-second delay
                })
                .catch((error) => {
                    // Show error message
                    successMsg.style.display = 'none';
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = 'block';
                });
        });
    }
});