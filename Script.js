/*********************************************
 * Mockly – Competitive Exam Prep
 * Firebase Auth + CAPTCHA + Forgot Password
 *********************************************/

let loginCaptchaAnswer = '';
let signupCaptchaAnswer = '';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  return { question: ${a} + ${b} = ?, answer: (a + b).toString() };
}

function refreshCaptchas() {
  const loginCap = generateCaptcha();
  const signupCap = generateCaptcha();
  loginCaptchaAnswer = loginCap.answer;
  signupCaptchaAnswer = signupCap.answer;

  const loginQ = document.getElementById('captchaQuestionLogin');
  const signupQ = document.getElementById('captchaQuestionSignup');
  if (loginQ) loginQ.textContent = loginCap.question;
  if (signupQ) signupQ.textContent = signupCap.question;

  const loginInput = document.getElementById('captchaInputLogin');
  const signupInput = document.getElementById('captchaInputSignup');
  if (loginInput) loginInput.value = '';
  if (signupInput) signupInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('active');
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('active');
      }
    });
  });

  setupModal();

  if (typeof initAuthListener === 'function') {
    initAuthListener(updateUIForAuth);
  }
});

function setupModal() {
  const overlay = document.getElementById('modalOverlay');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotForm');

  function openModal(type = 'login') {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    refreshCaptchas();

    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    if (forgotForm) forgotForm.style.display = 'none';

    if (type === 'login') loginForm.style.display = '';
    else if (type === 'signup') signupForm.style.display = '';
    else if (type === 'forgot') {
      if (forgotForm) forgotForm.style.display = '';
      // Pre-fill forgot email from login field if possible
      const loginEmail = document.getElementById('loginEmail');
      const forgotEmail = document.getElementById('forgotEmail');
      if (loginEmail && forgotEmail) forgotEmail.value = loginEmail.value;
    }
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    ['loginEmail','loginPassword','captchaInputLogin','signupName','signupEmail','signupPassword','signupConfirm','captchaInputSignup','forgotEmail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const msg = document.getElementById('forgotMessage');
    if (msg) msg.textContent = '';
  }

  // Bind openers
  document.getElementById('btnLogin').addEventListener('click', () => openModal('login'));
  document.getElementById('btnSignup').addEventListener('click', () => openModal('signup'));
  document.getElementById('btnLoginMobile').addEventListener('click', () => openModal('login'));
  document.getElementById('btnSignupMobile').addEventListener('click', () => openModal('signup'));

  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  // Switch forms
  document.getElementById('switchToSignup').addEventListener('click', () => openModal('signup'));
  document.getElementById('switchToLogin').addEventListener('click', () => openModal('login'));

  // Forgot password
  document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('forgot');
  });
  document.getElementById('backToLogin').addEventListener('click', () => openModal('login'));

  // Login submit
  document.getElementById('loginSubmitBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const captcha = document.getElementById('captchaInputLogin').value.trim();
    if (!email || !password) return alert('Please fill all fields.');
    if (captcha !== loginCaptchaAnswer) {
      alert('Incorrect CAPTCHA');
      refreshCaptchas();
      return;
    }
    try {
      await loginUser(email, password);
      window.location.href = 'dashboard.html';
    } catch (e) { alert('Login failed: ' + e.message); }
  });

  // Signup submit
  document.getElementById('signupSubmitBtn').addEventListener('click', async () => {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirm = document.getElementById('signupConfirm').value.trim();
    const captcha = document.getElementById('captchaInputSignup').value.trim();
    if (!name || !email || !password || !confirm) return alert('All fields required.');
    if (password !== confirm) return alert('Passwords do not match.');
    if (password.length < 8) return alert('Password must be at least 8 characters.');
    if (captcha !== signupCaptchaAnswer) {
      alert('Incorrect CAPTCHA');
      refreshCaptchas();
      return;
    }
    try {
      await signupUser(email, password, name);
      window.location.href = 'dashboard.html';
    } catch (e) { alert('Signup failed: ' + e.message); }
  });

  // Forgot password submit
  document.getElementById('forgotSubmitBtn').addEventListener('click', async () => {
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) return alert('Enter your email.');
    const msg = document.getElementById('forgotMessage');
    msg.textContent = 'Sending reset email…';
    msg.style.color = '';
    try {
      await sendPasswordReset(email);
      msg.textContent = '✅ Reset email sent! Check your inbox.';
      msg.style.color = '#16a34a';
    } catch (e) {
      msg.textContent = '❌ ' + e.message;
      msg.style.color = '#d32f2f';
    }
  });

  // Google sign-in
  async function googleAuth() {
    try {
      await signInWithGoogle();
      window.location.href = 'dashboard.html';
    } catch (e) { alert('Google sign-in failed: ' + e.message); }
  }
  document.getElementById('googleSignInBtn').addEventListener('click', googleAuth);
  document.getElementById('googleSignUpBtn').addEventListener('click', googleAuth);
}

function updateUIForAuth(user) {
  const navActions = document.querySelector('.nav-actions');
  const mobileActions = document.querySelector('.mobile-actions');
  if (!navActions || !mobileActions) return;
  if (user) {
    navActions.innerHTML = <button class="btn btn-outline" id="btnDashboard">Dashboard</button><button class="btn btn-primary" id="btnLogout">Logout</button>;
    mobileActions.innerHTML = <button class="btn btn-outline" id="btnDashboardM">Dashboard</button><button class="btn btn-primary" id="btnLogoutM">Logout</button>;
    document.getElementById('btnDashboard').addEventListener('click', () => window.location.href = 'dashboard.html');
    document.getElementById('btnDashboardM').addEventListener('click', () => window.location.href = 'dashboard.html');
    document.getElementById('btnLogout').addEventListener('click', () => logoutUser());
    document.getElementById('btnLogoutM').addEventListener('click', () => logoutUser());
  } else {
    navActions.innerHTML = <button class="btn btn-outline" id="btnLogin">Login</button><button class="btn btn-primary" id="btnSignup">Sign Up</button>;
    mobileActions.innerHTML = <button class="btn btn-outline" id="btnLoginMobile">Login</button><button class="btn btn-primary" id="btnSignupMobile">Sign Up</button>;
    document.getElementById('btnLogin').addEventListener('click', () => document.getElementById('modalOverlay').classList.add('active'));
    document.getElementById('btnSignup').addEventListener('click', () => document.getElementById('modalOverlay').classList.add('active'));
    document.getElementById('btnLoginMobile').addEventListener('click', () => document.getElementById('modalOverlay').classList.add('active'));
    document.getElementById('btnSignupMobile').addEventListener('click', () => document.getElementById('modalOverlay').classList.add('active'));
  }
}
