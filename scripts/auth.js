document.addEventListener('DOMContentLoaded', () => {

    // Get the auth service and db from the main.js-initialized app
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.onAuthStateChanged(user => user && setupProfileIconHandler(user));

    // Setup profile icon click handler
    async function setupProfileIconHandler(user) {
        const profileIcon = document.getElementById('profile-icon');
        if (!profileIcon) return;
    
        const newProfileIcon = profileIcon.cloneNode(true);
        profileIcon.parentNode.replaceChild(newProfileIcon, profileIcon);
        
        newProfileIcon.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Add a visual indicator that something is happening
            newProfileIcon.style.opacity = '0.6';
            try {
                // Get user role from Firestore
                const userDoc = await db.collection('users').doc(user.uid).get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const role = userData.role;

                    // Redirect based on role
                    if (role === 'mentee') {
                        window.location.href = 'mentee-dashboard.html';
                    } else if (role === 'mentor') {
                        window.location.href = 'mentor-dashboard.html';
                    } else {
                        console.error('Unknown role:', role);
                        alert('Unable to determine user role. Please contact support.');
                    }
                } else {
                    console.error('User document not found');
                    alert('User profile not found. Please contact support.');
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                alert('Failed to load profile. Please try again.');
            } finally {
                newProfileIcon.style.opacity = '1';
            }
        });
    }

    // --- Logout Handler ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
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
    }

    // --- Login Form Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const successMsg = document.getElementById('success-message');
        const errorMsg = document.getElementById('error-message');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    errorMsg.style.display = 'none';
                    successMsg.textContent = 'Login successful! Redirecting to home...';
                    successMsg.style.display = 'block';

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000); 
                })
                .catch((error) => {
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
            
            // Get all form values
            const fullName = document.getElementById('signup-name').value;
            const role = document.getElementById('signup-role').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // 1. Create the user in Firebase Auth
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // User created. Now, save extra data to Firestore
                    console.log('User created:', userCredential.user.uid);

                    // 2. Save user data to Firestore
                    return db.collection("users").doc(userCredential.user.uid).set({
                        fullName: fullName,
                        email: email,
                        role: role,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    // 3. Show success and redirect
                    console.log('User data saved to Firestore.');
                    errorMsg.style.display = 'none';
                    successMsg.textContent = 'Sign up successful! Redirecting to home...';
                    successMsg.style.display = 'block';

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                })
                .catch((error) => {
                    // Handle errors from either Auth or Firestore
                    console.error('Sign Up Error:', error);
                    successMsg.style.display = 'none';
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = 'block';
                });
        });
    }
});