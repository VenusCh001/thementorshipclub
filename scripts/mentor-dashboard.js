// Mentor Dashboard Specific Functionality
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    let currentUser = null;

    // Wait for authentication
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadMentorApplications();
        }
    });

    // Handle mentor application form submission
    const mentorForm = document.getElementById('mentor-application-form');
    if (mentorForm) {
        mentorForm.addEventListener('submit', async (e) => {
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
                expertiseLevel: document.getElementById('expertise-level').value,
                experience: document.getElementById('experience').value,
                expertise: document.getElementById('expertise').value,
                motivation: document.getElementById('motivation').value,
                availability: document.getElementById('availability').value,
                startDate: document.getElementById('start-date').value,
                linkedin: document.getElementById('linkedin').value || '',
                portfolio: document.getElementById('portfolio').value || '',
                status: 'pending',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Disable submit button
            const submitBtn = mentorForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            try {
                // Save to Firestore
                await db.collection('mentor_applications').add(formData);

                // Show success message
                showMessage('success', 'Mentor application submitted successfully! We will review it shortly.');

                // Reset form
                mentorForm.reset();

                // Reload applications
                setTimeout(() => {
                    loadMentorApplications();
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

    // Load mentor applications
    async function loadMentorApplications() {
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
            const snapshot = await db.collection('mentor_applications')
                .where('userId', '==', currentUser.uid)
                .orderBy('submittedAt', 'desc')
                .get();

            if (snapshot.empty) {
                // No applications found
                applicationsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Applications Yet</h3>
                        <p>You haven't submitted any mentor applications. Start by applying to become a mentor!</p>
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
        const linksHtml = (app.linkedin || app.portfolio) ? `
            <div class="detail-row">
                <label>Links:</label>
                <span style="display: flex; gap: 0.5rem;">
                    ${app.linkedin ? `<a href="${app.linkedin}" target="_blank" style="color: var(--primary-color);"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${app.portfolio ? `<a href="${app.portfolio}" target="_blank" style="color: var(--primary-color);"><i class="fas fa-link"></i></a>` : ''}
                </span>
            </div>
        ` : '';

        return `
            <div class="application-card">
                <div class="application-header">
                    <div>
                        <h3>${app.programName}</h3>
                        <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.3rem;">
                            ${app.expertiseLevel}
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
                        <label>Available From:</label>
                        <span>${new Date(app.startDate).toLocaleDateString()}</span>
                    </div>
                    ${linksHtml}
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