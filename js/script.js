/*********************************************
 * Mockly Dashboard Script
 * Fetches user info & displays dummy data
 *********************************************/

document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // Not logged in – redirect to index
      window.location.href = 'index.html';
      return;
    }

    // Populate user info
    const displayName = user.displayName || user.email.split('@')[0];
    const email = user.email;
    const initial = displayName.charAt(0).toUpperCase();

    document.getElementById('avatarInitials').textContent = initial;
    document.getElementById('dashboardName').textContent = displayName;
    document.getElementById('dashboardEmail').textContent = email;

    // Dummy stats (replace with real data from a backend later)
    document.getElementById('dashTestsTaken').textContent = '12';
    document.getElementById('dashAvgScore').textContent = '78%';
    document.getElementById('dashRank').textContent = '#23';
    document.getElementById('dashQuestions').textContent = '480';

    // Dummy recent tests
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

    // Logout button
    document.getElementById('btnLogout').addEventListener('click', async () => {
      await firebase.auth().signOut();
      window.location.href = 'index.html';
    });
  });
});
