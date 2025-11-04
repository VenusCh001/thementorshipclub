document.addEventListener('DOMContentLoaded', () => {
    // === Dark/Light mode toggle ===
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
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
    }

    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'dark-mode') {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        }
    }

    // === Application Form Logic ===
    const auth = firebase.auth();
    const db = firebase.firestore();

    const menteeForm = document.querySelector('.mentee-form');
    if (menteeForm) {
        menteeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = auth.currentUser;
            if (!user) {
                // User is not logged in.
                // Ideally, you should ask them to log in/sign up first.
                // For now, we'll redirect them to the signup page.
                alert("Please sign up or log in before applying.");
                window.location.href = 'signup.html';
                return;
            }

            // User is logged in, proceed with application
            const submitBtn = menteeForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const formData = {
                fullName: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                college: document.getElementById('college').value,
                cohort: document.getElementById('cohort').value,
                goals: document.getElementById('goals').value,
                // --- Link to the logged-in user ---
                userId: user.uid,
                roleAppliedFor: 'mentee', // Hardcoded for this form
                status: 'Pending', // Default status
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // TODO: Add Firebase Storage logic for PDF upload here if needed.
            // For simplicity, this example skips file upload.

            // Check if user has already applied
            db.collection("applications").where("userId", "==", user.uid).get()
                .then(snapshot => {
                    if (!snapshot.empty) {
                        alert("You have already submitted an application.");
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Registration';
                    } else {
                        // No existing application, create a new one
                        db.collection("applications").add(formData)
                        .then(() => {
                            alert("Application submitted successfully!");
                            window.location.href = 'dashboard.html'; // Redirect to status page
                        })
                        .catch(error => {
                            console.error("Error submitting application: ", error);
                            alert("An error occurred. Please try again.");
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Submit Registration';
                        });
                    }
                });
        });
    }
});