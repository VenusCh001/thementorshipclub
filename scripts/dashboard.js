document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const statusContainer = document.getElementById('status-container');
    const loadingStatus = document.getElementById('loading-status');

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in, find their application
            db.collection("applications").where("userId", "==", user.uid).limit(1).get()
                .then(snapshot => {
                    loadingStatus.style.display = 'none'; // Hide loading message
                    
                    if (snapshot.empty) {
                        // No application found
                        statusContainer.innerHTML = `
                            <div class="application-card">
                                <h3>No Application Found</h3>
                                <p>You have not submitted an application yet.</p>
                                <div class="app-actions">
                                    <a href="joinnow.html" class="btn-accept">Apply Now</a>
                                </div>
                            </div>
                        `;
                    } else {
                        // Display application status
                        const app = snapshot.docs[0].data();
                        let statusMessage = '';
                        let statusClass = '';

                        switch (app.status) {
                            case 'Pending':
                                statusMessage = 'Your application is currently under review.';
                                statusClass = 'status-pending';
                                break;
                            case 'Accepted':
                                statusMessage = 'Congratulations! Your application has been accepted.';
                                statusClass = 'status-accepted';
                                break;
                            case 'Rejected':
                                statusMessage = 'We regret to inform you that your application was not accepted at this time.';
                                statusClass = 'status-rejected';
                                break;
                        }

                        statusContainer.innerHTML = `
                            <div class="application-card">
                                <h3>Your Application Status: <span class="${statusClass}">${app.status}</span></h3>
                                <p>${statusMessage}</p>
                                <hr style="margin: 1rem 0; border: 0; border-top: 1px solid var(--border-color);">
                                <div class="app-body">
                                    <p><strong>Name:</strong> ${app.fullName}</p>
                                    <p><strong>Cohort:</strong> ${app.cohort}</p>
                                    <p><strong>Role Applied For:</strong> ${app.roleAppliedFor}</p>
                                </div>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    console.error("Error fetching application status: ", error);
                    loadingStatus.textContent = 'Error loading status. Please try again.';
                });

        } else {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
        }
    });
});
