document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const loadingMsg = document.getElementById('loading-message');
    const appSections = document.getElementById('application-sections');
    const menteeList = document.getElementById('mentee-applications-list');
    const mentorList = document.getElementById('mentor-applications-list');
    const noMentees = document.getElementById('no-mentees');
    const noMentors = document.getElementById('no-mentors');

    let menteeCount = 0;
    let mentorCount = 0;

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in, check their role
            const userRef = db.collection("users").doc(user.uid);
            userRef.get().then(doc => {
                if (doc.exists && doc.data().role === 'admin') {
                    // User is an admin, load applications
                    loadingMsg.style.display = 'none';
                    appSections.style.display = 'block';
                    loadApplications();
                } else {
                    // Not an admin, redirect to home
                    console.warn("Unauthorized access attempt.");
                    window.location.href = 'index.html';
                }
            }).catch(error => {
                console.error("Error getting user data:", error);
                window.location.href = 'index.html';
            });
        } else {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
        }
    });

    function loadApplications() {
        db.collection("applications").where("status", "==", "Pending").onSnapshot(querySnapshot => {
            // Clear lists
            menteeList.innerHTML = '';
            mentorList.innerHTML = '';
            menteeCount = 0;
            mentorCount = 0;

            if (querySnapshot.empty) {
                noMentees.style.display = 'block';
                noMentors.style.display = 'block';
                return;
            }

            querySnapshot.forEach(doc => {
                const app = doc.data();
                const appId = doc.id; // The application's document ID

                const card = document.createElement('li');
                card.className = 'application-card';
                card.innerHTML = `
                    <div class="app-header">
                        <h3>${app.fullName}</h3>
                        <span>${app.email}</span>
                    </div>
                    <div class="app-body">
                        <p><strong>Role:</strong> ${app.roleAppliedFor}</p>
                        <p><strong>Cohort:</strong> ${app.cohort}</p>
                        <p><strong>Goals:</strong> ${app.goals}</p>
                        <p><strong>Applied on:</strong> ${app.createdAt ? new Date(app.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div class="app-actions">
                        <button class="btn-accept" data-id="${appId}">Accept</button>
                        <button class="btn-reject" data-id="${appId}">Reject</button>
                    </div>
                `;

                // Add to the correct list
                if (app.roleAppliedFor === 'mentor') {
                    mentorList.appendChild(card);
                    mentorCount++;
                } else {
                    menteeList.appendChild(card);
                    menteeCount++;
                }
            });

            // Show empty messages if counts are zero
            noMentees.style.display = menteeCount === 0 ? 'block' : 'none';
            noMentors.style.display = mentorCount === 0 ? 'block' : 'none';

            // Add event listeners for the new buttons
            addApprovalListeners();
        }, error => {
            console.error("Error fetching applications: ", error);
        });
    }

    function addApprovalListeners() {
        document.querySelectorAll('.btn-accept').forEach(button => {
            button.addEventListener('click', (e) => {
                const appId = e.target.dataset.id;
                updateApplicationStatus(appId, "Accepted");
            });
        });

        document.querySelectorAll('.btn-reject').forEach(button => {
            button.addEventListener('click', (e) => {
                const appId = e.target.dataset.id;
                updateApplicationStatus(appId, "Rejected");
            });
        });
    }

    function updateApplicationStatus(appId, newStatus) {
        const appRef = db.collection("applications").doc(appId);

        appRef.update({
            status: newStatus
        })
        .then(() => {
            console.log(`Application ${appId} updated to ${newStatus}`);
            // The onSnapshot listener will automatically refresh the list
        })
        .catch(error => {
            console.error("Error updating status: ", error);
        });
    }

});