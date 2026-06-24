/*********************************************
 * Mockly – Competitive Exam Prep
 * No modal – auth pages are separate.
 *********************************************/

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('active');
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        if (hamburger) hamburger.classList.remove('open');
        if (mobileMenu) mobileMenu.classList.remove('active');
      }
    });
  });

  // Firebase auth state listener – updates header buttons
  if (typeof initAuthListener === 'function') {
    initAuthListener(updateUIForAuth);
  } else {
    // Fallback: show default buttons
    updateUIForAuth(null);
  }
});

function updateUIForAuth(user) {
  const navActions = document.querySelector('.nav-actions');
  const mobileActions = document.querySelector('.mobile-actions');
  if (!navActions || !mobileActions) return;

  if (user) {
    // Logged in – show Dashboard + Logout
    navActions.innerHTML = `
      <a href="dashboard.html" class="btn btn-outline">Dashboard</a>
      <button class="btn btn-primary" id="btnLogout">Logout</button>`;
    mobileActions.innerHTML = `
      <a href="dashboard.html" class="btn btn-outline">Dashboard</a>
      <button class="btn btn-primary" id="btnLogoutM">Logout</button>`;

    document.getElementById('btnLogout')?.addEventListener('click', () => logoutUser());
    document.getElementById('btnLogoutM')?.addEventListener('click', () => logoutUser());
  } else {
    // Not logged in – show Login / Sign Up links
    navActions.innerHTML = `
      <a href="login.html" class="btn btn-outline">Login</a>
      <a href="signup.html" class="btn btn-primary">Sign Up</a>`;
    mobileActions.innerHTML = `
      <a href="login.html" class="btn btn-outline">Login</a>
      <a href="signup.html" class="btn btn-primary">Sign Up</a>`;
  }
}
