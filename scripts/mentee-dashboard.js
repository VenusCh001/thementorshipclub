// Mentee Dashboard Specific Functionality
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    let currentUser = null;

    // Wait for authentication
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadMenteeApplications();
        }
    });

    // Handle mentee application form submission
    const menteeForm = document.getElementById('mentee-application-form');
    if (menteeForm) {
        menteeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!currentUser) {
                showMessage('error', 'You must be logged in to submit an application.');
                return;
            }

            // Get form data
            const formData = {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                programName: document.getElementById('program-name').value,
                experienceLevel: document.getElementById('experience-level').value,
                whyJoin: document.getElementById('why-join').value,
                background: document.getElementById('background').value,
                goals: document.getElementById('goals').value,
                availability: document.getElementById('availability').value,
                startDate: document.getElementById('start-date').value,
                status: 'pending',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Disable submit button
            const submitBtn = menteeForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            try {
                // Save to Firestore
                await db.collection('mentee_applications').add(formData);

                // Show success message
                showMessage('success', 'Application submitted successfully! We will review it shortly.');

                // Reset form
                menteeForm.reset();

                // Reload applications
                setTimeout(() => {
                    loadMenteeApplications();
                }, 1000);

            } catch (error) {
                console.error('Error submitting application:', error);
                showMessage('error', 'Failed to submit application. Please try again.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
            }
        });
    }

    // Load mentee applications
    async function loadMenteeApplications() {
        const applicationsList = document.getElementById('applications-list');
        
        if (!currentUser) return;

        try {
            // Show loading state
            applicationsList.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading your applications...</p>
                </div>
            `;

            // Fetch applications from Firestore
            const snapshot = await db.collection('mentee_applications')
                .where('userId', '==', currentUser.uid)
                .orderBy('submittedAt', 'desc')
                .get();

            if (snapshot.empty) {
                // No applications found
                applicationsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Applications Yet</h3>
                        <p>You haven't submitted any applications. Start by applying to a program!</p>
                    </div>
                `;
                return;
            }

            // Display applications
            let html = '';
            snapshot.forEach(doc => {
                const app = doc.data();
                html += createApplicationCard(app, doc.id);
            });

            applicationsList.innerHTML = html;

        } catch (error) {
            console.error('Error loading applications:', error);
            applicationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error Loading Applications</h3>
                    <p>Failed to load your applications. Please refresh the page.</p>
                </div>
            `;
        }
    }

    // Create application card HTML
    function createApplicationCard(app, docId) {
        return `
            <div class="application-card">
                <div class="application-header">
                    <div>
                        <h3>${app.programName}</h3>
                        <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.3rem;">
                            ${app.experienceLevel}
                        </p>
                    </div>
                    ${getStatusBadge(app.status)}
                </div>
                <div class="application-details">
                    <div class="detail-row">
                        <label>Submitted:</label>
                        <span>${formatDate(app.submittedAt)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Time Commitment:</label>
                        <span>${app.availability} hrs/week</span>
                    </div>
                    <div class="detail-row">
                        <label>Start Date:</label>
                        <span>${new Date(app.startDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <label>Application ID:</label>
                        <span style="font-family: monospace; font-size: 0.85rem;">${docId.substring(0, 8)}...</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Set minimum date for start date picker to today
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.setAttribute('min', today);
    }
});