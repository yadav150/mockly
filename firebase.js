const firebaseConfig = {
  apiKey: "AIzaSyC3RBe6AlCewKXkcVS4cDEXLDbClTvBgBY",
  authDomain: "mockly2-fe6bc.firebaseapp.com",
  projectId: "mockly2-fe6bc",
  storageBucket: "mockly2-fe6bc.firebasestorage.app",
  messagingSenderId: "535116640494",
  appId: "1:535116640494:web:4a02c00886fff2572503ff"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

async function signupUser(email, password, displayName) {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName });
  return cred.user;
}
async function loginUser(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  return cred.user;
}
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await auth.signInWithPopup(provider);
  return result.user;
}
async function logoutUser() {
  await auth.signOut();
  window.location.reload();
}
async function sendPasswordReset(email) {
  await auth.sendPasswordResetEmail(email);
}
function initAuthListener(callback) {
  auth.onAuthStateChanged(user => callback(user));
}

window.signupUser = signupUser;
window.loginUser = loginUser;
window.signInWithGoogle = signInWithGoogle;
window.logoutUser = logoutUser;
window.sendPasswordReset = sendPasswordReset;
window.initAuthListener = initAuthListener;
