/****************************************************
 * MOCKLY FRONTEND LOGIC (no backend except Firebase)
 ****************************************************/

// ========== SAMPLE DATA ==========
const topicsData = [
  { id: 1, name: 'JavaScript Fundamentals', icon: 'JS', count: 120, difficulty: 'Medium' },
  { id: 2, name: 'Python Programming', icon: 'Py', count: 150, difficulty: 'Easy' },
  { id: 3, name: 'Data Structures & Algorithms', icon: 'DA', count: 200, difficulty: 'Hard' },
  { id: 4, name: 'React.js', icon: 'Re', count: 90, difficulty: 'Medium' },
  { id: 5, name: 'Node.js', icon: 'No', count: 85, difficulty: 'Medium' },
  { id: 6, name: 'SQL & Databases', icon: 'SQ', count: 110, difficulty: 'Easy' },
  { id: 7, name: 'System Design', icon: 'SD', count: 60, difficulty: 'Hard' },
  { id: 8, name: 'Operating Systems', icon: 'OS', count: 95, difficulty: 'Hard' },
];

const mockTestsData = [
  { id: 1, name: 'JavaScript Advanced Mock', topic: 'JavaScript', questions: 30, duration: 30, difficulty: 'Hard' },
  { id: 2, name: 'Python Basics Challenge', topic: 'Python', questions: 25, duration: 25, difficulty: 'Easy' },
  { id: 3, name: 'DSA Mastery Test', topic: 'DSA', questions: 40, duration: 45, difficulty: 'Hard' },
  { id: 4, name: 'React Components Quiz', topic: 'React.js', questions: 20, duration: 20, difficulty: 'Medium' },
  { id: 5, name: 'SQL Query Challenge', topic: 'SQL', questions: 35, duration: 35, difficulty: 'Medium' },
  { id: 6, name: 'Node.js Backend Mock', topic: 'Node.js', questions: 28, duration: 30, difficulty: 'Medium' },
];

const leaderboardData = [
  { rank: 1, name: 'Arjun Sharma', score: 98.5, tests: 42 },
  { rank: 2, name: 'Priya Patel', score: 96.2, tests: 38 },
  { rank: 3, name: 'Rohan Gupta', score: 94.8, tests: 55 },
  { rank: 4, name: 'Sneha Reddy', score: 92.1, tests: 31 },
  { rank: 5, name: 'Vikram Singh', score: 90.7, tests: 47 },
  { rank: 6, name: 'Ananya Iyer', score: 89.3, tests: 29 },
  { rank: 7, name: 'Karan Mehta', score: 87.5, tests: 36 },
  { rank: 8, name: 'Divya Nair', score: 85.9, tests: 44 },
];

const testimonialsData = [
  { quote: 'Mockly helped me crack my JavaScript interview! The timed tests are incredibly realistic.', author: 'Amit K.', role: 'Frontend Developer', stars: 5 },
  { quote: 'The leaderboard keeps me motivated. I practice every single day now.', author: 'Neha S.', role: 'CS Student', stars: 5 },
  { quote: 'Clean interface, no distractions. Exactly what I needed for focused prep.', author: 'Rahul M.', role: 'Data Analyst', stars: 4 },
];

const sampleQuestions = [
  { q: 'What does the â€œtypeofâ€ operator return for an array in JavaScript?', options: ['"array"', '"object"', '"list"', '"undefined"'], correct: 1 },
  { q: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
  { q: 'Output of â€œconsole.log(2 + "2")â€?', options: ['4', '"22"', '22', 'TypeError'], correct: 1 },
  { q: 'Keyword to declare a constant?', options: ['var', 'let', 'const', 'static'], correct: 2 },
  { q: 'What does â€œJSON.parse()â€ do?', options: ['Convert object to JSON string', 'Parse JSON string to object', 'Validate JSON syntax', 'Compress JSON'], correct: 1 },
];

// ========== GLOBAL STATE ==========
let currentPage = 'home';
let testState = {
  active: false,
  questions: [],
  currentIndex: 0,
  answers: {},
  timerSeconds: 0,
  timerInterval: null,
  testName: '',
  totalQuestions: 0,
  totalTime: 0,
};

// ========== NAVIGATION ==========
function navigate(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) {
    target.classList.add('active');
    currentPage = pageName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(â€œ.nav-links a[href="#${pageName}"]â€);
    if (navLink) navLink.classList.add('active');
    closeMenu();
    window.location.hash = pageName;
    // Page-specific init
    if (pageName === 'topics') renderAllTopics();
    if (pageName === 'mock-tests') renderAllMockTests();
    if (pageName === 'leaderboard') renderFullLeaderboard();
    if (pageName === 'home') renderHomePartial();
  }
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
  document.getElementById('hamburger').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('navLinks').classList.remove('show');
  document.getElementById('hamburger').classList.remove('open');
}

// Listen to hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);
});

// Initial load
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);
  renderHomePartial();
  // Firebase auth state listener (after firebase.js loaded)
  if (typeof window.initAuthListener === 'function') {
    window.initAuthListener(updateUIForAuth);
  } else {
    updateUIForAuth(null);
  }
});

// ========== RENDER HELPERS ==========
function getDifficultyBadge(difficulty) {
  const cls = difficulty === 'Easy' ? 'badge-easy' : difficulty === 'Medium' ? 'badge-medium' : 'badge-hard';
  return â€œ<span class="badge ${cls}">${difficulty}</span>â€;
}

function renderTopicsGrid(containerId, data, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = limit ? data.slice(0, limit) : data;
  container.innerHTML = items.map(t => `
    <div class="card" onclick="navigate('mock-tests')">
      <div class="icon-circle">${t.icon}</div>
      <h3>${t.name}</h3>
      <p class="meta">${t.count} questions Â· ${getDifficultyBadge(t.difficulty)}</p>
      <button class="btn btn-outline btn-sm" style="margin-top:10px;">Explore â†’</button>
    </div>
  `).join('');
}

function renderMockTestCards(containerId, data, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = limit ? data.slice(0, limit) : data;
  container.innerHTML = items.map(t => `
    <div class="card">
      <h3>${t.name}</h3>
      <p class="meta">ðŸ“ ${t.questions} Questions Â· â±ï¸ ${t.duration} min Â· ${getDifficultyBadge(t.difficulty)}</p>
      <p class="meta">ðŸ“‚ ${t.topic}</p>
      <button class="btn btn-primary btn-sm" onclick="startTest('${t.name}', ${t.questions}, ${t.duration})">Start Test</button>
    </div>
  `).join('');
}

function renderLeaderboardTable(containerId, data, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = limit ? data.slice(0, limit) : data;
  const rankClass = (r) => r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : '';
  container.innerHTML = `
    <thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Tests</th></tr></thead>
    <tbody>${items.map(lb => `
      <tr>
        <td class="rank ${rankClass(lb.rank)}">#${lb.rank}</td>
        <td><strong>${lb.name}</strong></td>
        <td>${lb.score}%</td>
        <td>${lb.tests}</td>
      </tr>â€œ).join('')}</tbody>â€;
}

function renderHomePartial() {
  renderTopicsGrid('topicsGrid', topicsData, 4);
  renderMockTestCards('featuredTestsGrid', mockTestsData, 3);
  renderLeaderboardTable('lbPreviewTable', leaderboardData, 5);
  renderTestimonials();
}

function renderAllTopics() { renderTopicsGrid('allTopicsGrid', topicsData); }
function renderAllMockTests() { renderMockTestCards('allMockTestsGrid', mockTestsData); }
function renderFullLeaderboard() { renderLeaderboardTable('fullLbTable', leaderboardData); }

function renderTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;
  container.innerHTML = testimonialsData.map(t => `
    <div class="testimonial-card">
      <div class="stars">${'â˜…'.repeat(t.stars)}${'â˜†'.repeat(5-t.stars)}</div>
      <p class="quote">"${t.quote}"</p>
      <p class="author">${t.author}</p>
      <p class="author-role">${t.role}</p>
    </div>
  `).join('');
}

// ========== SEARCH ==========
function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) return;
  const foundTopic = topicsData.find(t => t.name.toLowerCase().includes(query));
  if (foundTopic) {
    navigate('topics');
    setTimeout(() => {
      const grid = document.getElementById('allTopicsGrid');
      if (grid) {
        grid.querySelectorAll('.card').forEach(c => {
          if (c.textContent.toLowerCase().includes(query)) {
            c.style.border = '2px solid var(--accent)';
            c.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }
    }, 350);
    return;
  }
  const foundTest = mockTestsData.find(t => t.name.toLowerCase().includes(query) || t.topic.toLowerCase().includes(query));
  if (foundTest) {
    navigate('mock-tests');
    return;
  }
  alert('No results found for "' + query + '". Try "JavaScript", "Python", or "SQL".');
}

// ========== TEST LOGIC ==========
function startTest(testName, totalQuestions, totalTime) {
  const questions = [];
  for (let i = 0; i < totalQuestions; i++) {
    const sq = sampleQuestions[i % sampleQuestions.length];
    questions.push({ q: sq.q, options: [...sq.options], correct: sq.correct });
  }
  testState = {
    active: true,
    questions,
    currentIndex: 0,
    answers: {},
    timerSeconds: totalTime * 60,
    timerInterval: null,
    testName,
    totalQuestions,
    totalTime,
  };
  navigate('test');
  renderTestQuestion();
  startTimer();
}

function startTimer() {
  clearInterval(testState.timerInterval);
  testState.timerInterval = setInterval(() => {
    testState.timerSeconds--;
    updateTimerDisplay();
    if (testState.timerSeconds <= 0) {
      clearInterval(testState.timerInterval);
      submitTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('testTimer');
  if (!timerEl) return;
  const mins = Math.floor(testState.timerSeconds / 60);
  const secs = testState.timerSeconds % 60;
  timerEl.textContent = â€œ${mins}:${secs.toString().padStart(2, '0')}â€;
  timerEl.classList.toggle('warning', testState.timerSeconds < 60);
}

function renderTestQuestion() {
  const container = document.getElementById('testContainer');
  if (!container) return;
  const idx = testState.currentIndex;
  const q = testState.questions[idx];
  const progress = ((idx + 1) / testState.totalQuestions) * 100;
  const selected = testState.answers[idx];
  container.innerHTML = `
    <div class="test-header">
      <span class="test-title">ðŸ“ ${testState.testName}</span>
      <span class="timer" id="testTimer">${formatTime(testState.timerSeconds)}</span>
    </div>
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" style="width:${progress}%;"></div>
    </div>
    <div class="question-block">
      <p class="q-num">Question ${idx+1} of ${testState.totalQuestions}</p>
      <p class="q-text">${q.q}</p>
      <ul class="options-list">
        ${q.options.map((opt, oi) => `
          <li class="${selected === oi ? 'selected' : ''}" onclick="selectAnswer(${oi})">
            ${String.fromCharCode(65+oi)}. ${opt}
          </li>`).join('')}
      </ul>
    </div>
    <div class="test-nav">
      <button class="btn-prev" ${idx===0?'disabled':''} onclick="prevQuestion()">â† Previous</button>
      <span style="font-weight:600;">${idx+1}/${testState.totalQuestions}</span>
      ${idx < testState.totalQuestions-1
        ? '<button class="btn-next" onclick="nextQuestion()">Next â†’</button>'
        : '<button class="btn-submit" onclick="submitTest()">âœ“ Submit Test</button>'}
    </div>`;
  updateTimerDisplay();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return â€œ${m}:${s.toString().padStart(2, '0')}â€;
}

function selectAnswer(optIndex) {
  testState.answers[testState.currentIndex] = optIndex;
  renderTestQuestion();
}

function nextQuestion() {
  if (testState.currentIndex < testState.totalQuestions-1) {
    testState.currentIndex++;
    renderTestQuestion();
  }
}

function prevQuestion() {
  if (testState.currentIndex > 0) {
    testState.currentIndex--;
    renderTestQuestion();
  }
}

function submitTest() {
  clearInterval(testState.timerInterval);
  testState.active = false;
  let correctCount = 0, incorrectCount = 0, unansweredCount = 0;
  const reviewItems = [];
  testState.questions.forEach((q, i) => {
    const userAns = testState.answers[i];
    const isCorrect = userAns === q.correct;
    if (userAns === undefined || userAns === null) {
      unansweredCount++;
      reviewItems.push({ q: q.q, user: 'Not answered', correctAns: q.options[q.correct], isCorrect: false, skipped: true });
    } else if (isCorrect) {
      correctCount++;
      reviewItems.push({ q: q.q, user: q.options[userAns], correctAns: q.options[q.correct], isCorrect: true, skipped: false });
    } else {
      incorrectCount++;
      reviewItems.push({ q: q.q, user: q.options[userAns], correctAns: q.options[q.correct], isCorrect: false, skipped: false });
    }
  });
  const total = testState.totalQuestions;
  const score = Math.round((correctCount / total) * 100);
  const timeTakenSec = (testState.totalTime * 60) - testState.timerSeconds;
  window._lastResults = {
    score, correctCount, incorrectCount, unansweredCount, total,
    timeTaken: â€œ${Math.floor(timeTakenSec/60)}m ${timeTakenSec%60}sâ€,
    reviewItems, testName: testState.testName,
  };
  navigate('results');
  renderResults();
}

function renderResults() {
  const container = document.getElementById('resultsContainer');
  const r = window._lastResults;
  if (!container || !r) {
    container.innerHTML = '<p style="text-align:center;padding:40px;">No results available. <a href="#mock-tests" onclick="navigate(\'mock-tests\')">Take a test</a>.</p>';
    return;
  }
  const passed = r.score >= 60;
  container.innerHTML = `
    <h2>ðŸ“Š Test Results</h2>
    <p style="color:var(--text-muted);">${r.testName}</p>
    <div class="score-circle ${passed ? '' : 'fail'}">${r.score}%</div>
    <p style="font-weight:600;">${passed ? 'ðŸŽ‰ Great job!' : 'ðŸ’ª Keep practicing!'}</p>
    <div class="results-stats">
      <div class="stat-box"><div class="stat-val" style="color:#16a34a;">${r.correctCount}</div><div class="stat-lbl">Correct</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#d32f2f;">${r.incorrectCount}</div><div class="stat-lbl">Incorrect</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#888;">${r.unansweredCount}</div><div class="stat-lbl">Skipped</div></div>
      <div class="stat-box"><div class="stat-val">${r.timeTaken}</div><div class="stat-lbl">Time Taken</div></div>
    </div>
    <div class="review-list">
      <h3 style="text-align:left;margin-bottom:8px;">Question Review</h3>
      ${r.reviewItems.map((ri, i) => `
        <div class="review-item ${ri.isCorrect ? 'correct' : 'incorrect'}">
          <strong>Q${i+1}:</strong> ${ri.q}<br>
          <span style="font-size:0.8rem;">Your answer: <strong>${ri.user}</strong> ${ri.skipped?'âš ï¸':''} | Correct: <strong>${ri.correctAns}</strong></span>
        </div>`).join('')}
    </div>
    <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="navigate('mock-tests')">Take Another Test</button>
      <button class="btn btn-outline" onclick="navigate('dashboard')">Go to Dashboard</button>
    </div>`;
}

// ========== AUTH UI UPDATE ==========
function updateUIForAuth(user) {
  const loginBtn = document.getElementById('navLogin');
  const signupBtn = document.getElementById('navSignup');
  if (user) {
    // User is logged in
    if (loginBtn) loginBtn.outerHTML = '<a href="#dashboard" class="btn-outline-nav" onclick="navigate(\'dashboard\')">Dashboard</a>';
    if (signupBtn) signupBtn.outerHTML = '<a href="#" class="btn-nav" onclick="logoutUser()">Logout</a>';
    // Update dashboard welcome
    const dashWelcome = document.getElementById('dashboardWelcome');
    if (dashWelcome) dashWelcome.textContent = â€œWelcome, ${user.displayName || user.email}!â€;
  } else {
    // Not logged in
    if (loginBtn) loginBtn.outerHTML = '<a href="#login" class="btn-outline-nav" id="navLogin" onclick="navigate(\'login\')">Login</a>';
    if (signupBtn) signupBtn.outerHTML = '<a href="#signup" class="btn-nav" id="navSignup" onclick="navigate(\'signup\')">Sign Up</a>';
    const dashWelcome = document.getElementById('dashboardWelcome');
    if (dashWelcome) dashWelcome.textContent = 'Welcome back!';
  }
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks');
  if (nav.classList.contains('show') && !e.target.closest('.navbar') && !e.target.closest('.hamburger')) {
    closeMenu();
  }
});

// Keyboard shortcuts for test
document.addEventListener('keydown', (e) => {
  if (!testState.active) return;
  if (e.key === 'ArrowRight') nextQuestion();
  if (e.key === 'ArrowLeft') prevQuestion();
  if (e.key >= '1' && e.key <= '4') {
    const opt = parseInt(e.key)-1;
    if (opt < testState.questions[testState.currentIndex].options.length) selectAnswer(opt);
  }
});
