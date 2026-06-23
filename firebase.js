/****************************************************
 * Firebase configuration and auth functions
 * Replace the config object with your own credentials.
 ****************************************************/

// Your web app's Firebase configuration (REPLACE WITH YOUR OWN)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ========== AUTHENTICATION FUNCTIONS ==========

// Sign up with email and password
async function signupUser(email, password, displayName) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    // Update profile with display name
    await userCredential.user.updateProfile({ displayName: displayName });
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

// Login with email and password
async function loginUser(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Logout
async function logoutUser() {
  try {
    await auth.signOut();
    // Navigate to home after logout
    if (typeof navigate === 'function') navigate('home');
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Listen to auth state changes and update UI
function initAuthListener(callback) {
  auth.onAuthStateChanged((user) => {
    if (callback && typeof callback === 'function') {
      callback(user);
    }
  });
}

// Make functions globally available (used in script.js)
window.signupUser = signupUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.initAuthListener = initAuthListener;

// ========== HANDLERS FOR LOGIN/SIGNUP FORMS ==========
// These functions are called from onclick in HTML
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorDiv = document.getElementById('loginError');
  if (!email || !password) {
    if (errorDiv) errorDiv.textContent = 'Please fill in all fields.';
    return;
  }
  try {
    await loginUser(email, password);
    // Navigate to dashboard on success
    if (typeof navigate === 'function') navigate('dashboard');
    if (errorDiv) errorDiv.textContent = '';
  } catch (error) {
    if (errorDiv) errorDiv.textContent = error.message;
  }
}

async function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();
  const errorDiv = document.getElementById('signupError');
  if (!name || !email || !password || !confirm) {
    if (errorDiv) errorDiv.textContent = 'Please fill in all fields.';
    return;
  }
  if (password !== confirm) {
    if (errorDiv) errorDiv.textContent = 'Passwords do not match.';
    return;
  }
  if (password.length < 8) {
    if (errorDiv) errorDiv.textContent = 'Password must be at least 8 characters.';
    return;
  }
  try {
    await signupUser(email, password, name);
    if (typeof navigate === 'function') navigate('dashboard');
    if (errorDiv) errorDiv.textContent = '';
  } catch (error) {
    if (errorDiv) errorDiv.textContent = error.message;
  }
}

// Expose to global scope
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
