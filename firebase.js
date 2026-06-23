/****************************************************
 * Firebase Authentication (Compat SDK)
 * Replace the config object with your own credentials.
 * This file must be loaded AFTER the Firebase compat scripts.
 ****************************************************/

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3RBe6AlCewKXkcVS4cDEXLDbClTvBgBY",
  authDomain: "mockly2-fe6bc.firebaseapp.com",
  projectId: "mockly2-fe6bc",
  storageBucket: "mockly2-fe6bc.firebasestorage.app",
  messagingSenderId: "535116640494",
  appId: "1:535116640494:web:4a02c00886fff2572503ff",
  measurementId: "G-VGL50BKX19"
};

// Initialize Firebase (using compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ========== AUTHENTICATION FUNCTIONS ==========

// Sign up with email, password, and display name
async function signupUser(email, password, displayName) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    // Update the user's profile with the display name
    await userCredential.user.updateProfile({ displayName: displayName });
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error; // Re-throw to handle in the UI
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
    if (typeof navigate === 'function') navigate('home');
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Listen to auth state changes and update UI accordingly
function initAuthListener(callback) {
  auth.onAuthStateChanged((user) => {
    if (callback && typeof callback === 'function') {
      callback(user);
    }
  });
}

// Make functions globally available (they will be called from Script.js)
window.signupUser = signupUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.initAuthListener = initAuthListener;
