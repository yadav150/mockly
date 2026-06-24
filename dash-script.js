/*********************************************
 * Mockly Dashboard Script
 * Fetches user info, displays dummy data,
 * and handles logout with a popup animation.
 *********************************************/

document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // Not logged in – redirect to index
      window.location.href = 'index.html';
      return;
    }

    // ----- Derive a friendly name -----
    let firstName = '';
    if (user.displayName) {
      // Use the first word of displayName
      firstName = user.displayName.split(' ')[0];
    } else if (user.email) {
      // Extract username before '@' and capitalise first letter
      const username = user.email.split('@')[0];
      // Replace dots/underscores with spaces, then capitalise each word
      firstName = username
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      // Take only the first word if it contains spaces
      firstName = firstName.split(' ')[0];
    }

    // If still empty, fallback
    if (!firstName) firstName = 'Student';

    // Set greeting
    document.getElementById('dashboardName').textContent = `Hello, ${firstName}`;
    document.getElementById('dashboardEmail').textContent = user.email;

    // Keep the human silhouette SVG; we don't need to change it
    // but we can set a title for accessibility
    const avatarCircle = document.getElementById('avatarCircle');
    if (avatarCircle) {
      avatarCircle.setAttribute('title', firstName);
    }

    // ----- Dummy stats (replace with real data later) -----
    document.getElementById('dashTestsTaken').textContent = '12';
    document.getElementById('dashAvgScore').textContent = '78%';
    document.getElementById('dashRank').textContent = '#23';
    document.getElementById('dashQuestions').textContent = '480';

    // ----- Dummy recent tests -----
    const recentTests = [
      { exam: 'JavaScript Advanced', date: '2026-06-20', score: '85%', status: 'Passed' },
      { exam: 'Python Basics', date: '2026-06-18', score: '92%', status: 'Passed' },
      { exam: 'SQL Query Challenge', date: '2026-06-15', score: '68%', status: 'Failed' },
      { exam: 'React Components', date: '2026-06-10', score: '74%', status: 'Passed' },
    ];

    const tbody = document.getElementById('recentTestsTable')?.querySelector('tbody');
    const noRecent = document.getElementById('noRecentTests');
    if (tbody) {
      if (recentTests.length === 0) {
        tbody.innerHTML = '';
        if (noRecent) noRecent.style.display = 'block';
      } else {
        if (noRecent) noRecent.style.display = 'none';
        tbody.innerHTML = recentTests.map(test => `
          <tr>
            <td><strong>${test.exam}</strong></td>
            <td>${test.date}</td>
            <td style="font-weight:600; color:${test.status === 'Passed' ? '#16a34a' : '#d32f2f'};">${test.score}</td>
            <td><span style="color:${test.status === 'Passed' ? '#16a34a' : '#d32f2f'};">${test.status}</span></td>
          </tr>
        `).join('');
      }
    }

    // ----- Logout with popup -----
    const logoutBtn = document.getElementById('btnLogout');
    const logoutOverlay = document.getElementById('logoutPopupOverlay');

    function showLogoutPopup() {
      // Show the popup with fade-in
      logoutOverlay.classList.add('active');
      logoutOverlay.setAttribute('aria-hidden', 'false');

      // After 2 seconds, actually log out and redirect
      setTimeout(() => {
        firebase.auth().signOut().then(() => {
          window.location.href = 'index.html';
        });
      }, 2000);
    }

    logoutBtn.addEventListener('click', showLogoutPopup);

    // Allow clicking outside the popup to cancel? No, we want it to log out anyway.
    // But we can close the popup if needed. For now, it's automatic.
  });
});
