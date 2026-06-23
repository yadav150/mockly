/*********************************************
 * Mockly Frontend Logic
 * Handles navigation, search, modals,
 * quiz generation, and results display.
 *********************************************/

// ========== SAMPLE DATA ==========
const topicsData = [
  { id: 1, name: 'JavaScript', icon: '📜', count: 120, difficulty: 'Medium' },
  { id: 2, name: 'Python', icon: '🐍', count: 150, difficulty: 'Easy' },
  { id: 3, name: 'Data Structures', icon: '📊', count: 200, difficulty: 'Hard' },
  { id: 4, name: 'React', icon: '⚛️', count: 90, difficulty: 'Medium' },
  { id: 5, name: 'SQL', icon: '🗃️', count: 110, difficulty: 'Easy' },
  { id: 6, name: 'Operating Systems', icon: '💻', count: 95, difficulty: 'Hard' },
  { id: 7, name: 'System Design', icon: '🏗️', count: 60, difficulty: 'Hard' },
  { id: 8, name: 'Node.js', icon: '🟢', count: 85, difficulty: 'Medium' },
];

const mockTestsData = [
  { id: 1, name: 'JavaScript Advanced', topic: 'JavaScript', questions: 30, duration: 30, difficulty: 'Hard' },
  { id: 2, name: 'Python Basics', topic: 'Python', questions: 25, duration: 25, difficulty: 'Easy' },
  { id: 3, name: 'DSA Mastery', topic: 'Data Structures', questions: 40, duration: 45, difficulty: 'Hard' },
  { id: 4, name: 'React Components', topic: 'React', questions: 20, duration: 20, difficulty: 'Medium' },
  { id: 5, name: 'SQL Query Challenge', topic: 'SQL', questions: 35, duration: 35, difficulty: 'Medium' },
  { id: 6, name: 'Node.js Backend', topic: 'Node.js', questions: 28, duration: 30, difficulty: 'Medium' },
];

const leaderboardData = [
  { rank: 1, name: 'Arjun Sharma', exam: 'JavaScript Advanced', score: 98.5 },
  { rank: 2, name: 'Priya Patel', exam: 'Python Basics', score: 96.2 },
  { rank: 3, name: 'Rohan Gupta', exam: 'DSA Mastery', score: 94.8 },
  { rank: 4, name: 'Sneha Reddy', exam: 'React Components', score: 92.1 },
  { rank: 5, name: 'Vikram Singh', exam: 'SQL Query Challenge', score: 90.7 },
];

const testimonialsData = [
  { quote: 'Mockly helped me crack my JavaScript interview! The timed tests are incredibly realistic.', author: 'Amit K.', role: 'Frontend Developer', stars: 5 },
  { quote: 'The leaderboard keeps me motivated. I practice every single day now.', author: 'Neha S.', role: 'CS Student', stars: 5 },
  { quote: 'Clean interface, no distractions. Exactly what I needed for focused prep.', author: 'Rahul M.', role: 'Data Analyst', stars: 4 },
];

const questionBank = [
  { q: 'What does `typeof` return for an array?', options: ['"array"', '"object"', '"list"', '"undefined"'], correct: 1 },
  { q: 'Which method adds to end of array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
  { q: 'Output of 2 + "2" in JS?', options: ['4', '"22"', '22', 'TypeError'], correct: 1 },
  { q: 'Keyword for constant?', options: ['var', 'let', 'const', 'static'], correct: 2 },
  { q: 'What does JSON.parse() do?', options: ['Object to JSON', 'JSON to object', 'Validate JSON', 'Compress'], correct: 1 },
  { q: 'Python list vs tuple?', options: ['Mutable/Immutable', 'Both mutable', 'Both immutable', 'None'], correct: 0 },
  { q: 'Time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
  { q: 'React hook for state?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 0 },
];

// ========== GLOBAL STATE ==========
let testState = {
  active: false,
  questions: [],
  currentIndex: 0,
  answers: {},
  timerSeconds: 0,
  timerInterval: null,
  topicName: '',
  totalQuestions: 0,
  totalTime: 0,
};

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
  renderTopics();
  renderMockTests();
  renderLeaderboard();
  renderTestimonials();
  setupSearch();
  setupSmoothScroll();
  setupModal();
  setupMobileMenu();
});

// ========== RENDER FUNCTIONS ==========

function getDifficultyBadge(difficulty) {
  const cls = difficulty === 'Easy' ? 'badge-easy' : difficulty === 'Medium' ? 'badge-medium' : 'badge-hard';
  return `<span class="badge ${cls}">${difficulty}</span>`;
}

function renderTopics() {
  const grid = document.getElementById('topicsGrid');
  if (!grid) return;
  grid.innerHTML = topicsData.map(t => `
    <div class="topic-card" data-topic-id="${t.id}">
      <div class="topic-icon">${t.icon}</div>
      <h3>${t.name}</h3>
      <p class="meta">${t.count} questions · ${getDifficultyBadge(t.difficulty)}</p>
      <button class="btn btn-primary btn-full start-topic-btn">Start Practice</button>
    </div>
  `).join('');

  // Add event listeners to Start Practice buttons
  document.querySelectorAll('.start-topic-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.topic-card');
      const topicId = parseInt(card.dataset.topicId);
      const topic = topicsData.find(t => t.id === topicId);
      if (topic) {
        startTest(topic.name, Math.min(topic.count, 15), 10); // 15 questions, 10 minutes
      }
    });
  });
}

function renderMockTests() {
  const grid = document.getElementById('mocktestsGrid');
  if (!grid) return;
  grid.innerHTML = mockTestsData.map(mt => `
    <div class="mocktest-card" data-test-id="${mt.id}">
      <h3>${mt.name}</h3>
      <p class="meta">📝 ${mt.questions} Questions · ⏱️ ${mt.duration} min · ${getDifficultyBadge(mt.difficulty)}</p>
      <p class="meta">📂 ${mt.topic}</p>
      <button class="btn btn-primary btn-full start-mock-btn">Start Test</button>
    </div>
  `).join('');

  document.querySelectorAll('.start-mock-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.mocktest-card');
      const testId = parseInt(card.dataset.testId);
      const test = mockTestsData.find(mt => mt.id === testId);
      if (test) {
        startTest(test.name, test.questions, test.duration);
      }
    });
  });
}

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;
  tbody.innerHTML = leaderboardData.map(lb => {
    const rankClass = lb.rank === 1 ? 'gold' : lb.rank === 2 ? 'silver' : lb.rank === 3 ? 'bronze' : '';
    return `
      <tr>
        <td class="rank ${rankClass}">#${lb.rank}</td>
        <td><strong>${lb.name}</strong></td>
        <td>${lb.exam}</td>
        <td>${lb.score}%</td>
      </tr>
    `;
  }).join('');
}

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  grid.innerHTML = testimonialsData.map(t => `
    <div class="testimonial-card">
      <div class="stars">${'★'.repeat(t.stars)}${'☆'.repeat(5 - t.stars)}</div>
      <p class="quote">"${t.quote}"</p>
      <p class="author">${t.author}</p>
      <p class="author-role">${t.role}</p>
    </div>
  `).join('');
}

// ========== SEARCH ==========
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const noResults = document.getElementById('noResults');

  function filterTopics() {
    const query = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.topic-card');
    let anyVisible = false;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (query === '' || text.includes(query)) {
        card.style.display = '';
        anyVisible = true;
      } else {
        card.style.display = 'none';
      }
    });

    noResults.classList.toggle('visible', !anyVisible && query !== '');
  }

  searchInput.addEventListener('input', filterTopics);
  searchBtn.addEventListener('click', filterTopics);
}

// ========== SMOOTH SCROLL ==========
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update hash without jump
        history.pushState(null, null, `#${targetId}`);
        // Close mobile menu if open
        document.getElementById('mobileMenu').classList.remove('active');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });
}

// ========== MODAL (Login/Signup) ==========
function setupModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignup = document.getElementById('btnSignup');
  const btnLoginMobile = document.getElementById('btnLoginMobile');
  const btnSignupMobile = document.getElementById('btnSignupMobile');
  const modalClose = document.getElementById('modalClose');
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const signupSubmitBtn = document.getElementById('signupSubmitBtn');

  function openModal(formType = 'login') {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    if (formType === 'login') {
      loginForm.style.display = '';
      signupForm.style.display = 'none';
      document.getElementById('modalTitle').textContent = 'Login';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = '';
      // modalTitle is only in login form, so we update the signup form h3
      const signupHeading = signupForm.querySelector('h3');
      if (signupHeading) signupHeading.textContent = 'Sign Up';
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    // Clear inputs
    document.querySelectorAll('#loginEmail, #loginPassword, #signupName, #signupEmail, #signupPassword').forEach(el => el.value = '');
  }

  btnLogin.addEventListener('click', () => openModal('login'));
  btnSignup.addEventListener('click', () => openModal('signup'));
  if (btnLoginMobile) btnLoginMobile.addEventListener('click', () => openModal('login'));
  if (btnSignupMobile) btnSignupMobile.addEventListener('click', () => openModal('signup'));
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  switchToSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = '';
    const signupHeading = signupForm.querySelector('h3');
    if (signupHeading) signupHeading.textContent = 'Sign Up';
  });

  switchToLogin.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = '';
    document.getElementById('modalTitle').textContent = 'Login';
  });

  // Handle login submit (frontend demo)
  loginSubmitBtn.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (email && password) {
      alert(`Login successful (demo)!\nWelcome, ${email}`);
      closeModal();
    } else {
      alert('Please fill in all fields.');
    }
  });

  // Handle signup submit
  signupSubmitBtn.addEventListener('click', () => {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    if (name && email && password) {
      alert(`Account created (demo)!\nWelcome, ${name}`);
      closeModal();
    } else {
      alert('Please fill in all fields.');
    }
  });
}

// ========== MOBILE MENU ==========
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('active');
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('active');
    });
  });
}

// ========== TEST LOGIC ==========
function startTest(topicName, totalQuestions, totalTimeMinutes) {
  // Generate questions from pool (cycle if needed)
  const questions = [];
  for (let i = 0; i < totalQuestions; i++) {
    const q = questionBank[i % questionBank.length];
    questions.push({ ...q, options: [...q.options] });
  }

  testState = {
    active: true,
    questions,
    currentIndex: 0,
    answers: {},
    timerSeconds: totalTimeMinutes * 60,
    timerInterval: null,
    topicName,
    totalQuestions,
    totalTime: totalTimeMinutes * 60,
  };

  // Hide all sections, show test page
  document.querySelectorAll('.section:not(.test-page):not(.results-page)').forEach(s => s.style.display = 'none');
  document.getElementById('testPage').style.display = '';
  document.getElementById('resultsPage').style.display = 'none';
  renderTestQuestion();
  startTimer();
  // Scroll to test page
  document.getElementById('testPage').scrollIntoView({ behavior: 'smooth' });
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
  const el = document.getElementById('testTimer');
  if (!el) return;
  const m = Math.floor(testState.timerSeconds / 60);
  const s = testState.timerSeconds % 60;
  el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  el.classList.toggle('warning', testState.timerSeconds < 60);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
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
      <span class="test-title">${testState.topicName} Quiz</span>
      <span class="timer" id="testTimer">${formatTime(testState.timerSeconds)}</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="q-num">Question ${idx + 1} of ${testState.totalQuestions}</div>
    <div class="q-text">${q.q}</div>
    <ul class="options-list">
      ${q.options.map((opt, oi) => `
        <li class="${selected === oi ? 'selected' : ''}" onclick="selectAnswer(${oi})">
          ${String.fromCharCode(65 + oi)}. ${opt}
        </li>
      `).join('')}
    </ul>
    <div class="test-nav">
      <button class="btn btn-prev" ${idx === 0 ? 'disabled' : ''} onclick="prevQuestion()">← Previous</button>
      <span>${idx + 1}/${testState.totalQuestions}</span>
      ${idx < testState.totalQuestions - 1
        ? '<button class="btn btn-next" onclick="nextQuestion()">Next →</button>'
        : '<button class="btn btn-submit" onclick="submitTest()">Submit</button>'
      }
    </div>
  `;
  updateTimerDisplay();
}

function selectAnswer(optIdx) {
  testState.answers[testState.currentIndex] = optIdx;
  renderTestQuestion();
}

function nextQuestion() {
  if (testState.currentIndex < testState.totalQuestions - 1) {
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
  let correct = 0, incorrect = 0, skipped = 0;
  const review = [];
  testState.questions.forEach((q, i) => {
    const userAns = testState.answers[i];
    const isCorrect = userAns === q.correct;
    if (userAns === undefined || userAns === null) {
      skipped++;
      review.push({ q: q.q, user: 'Not answered', correctAns: q.options[q.correct], isCorrect: false });
    } else if (isCorrect) {
      correct++;
      review.push({ q: q.q, user: q.options[userAns], correctAns: q.options[q.correct], isCorrect: true });
    } else {
      incorrect++;
      review.push({ q: q.q, user: q.options[userAns], correctAns: q.options[q.correct], isCorrect: false });
    }
  });
  const score = Math.round((correct / testState.totalQuestions) * 100);
  const timeTaken = testState.totalTime - testState.timerSeconds;

  // Store results for display
  window._lastResults = {
    score, correct, incorrect, skipped, total: testState.totalQuestions,
    time: `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`,
    review, topic: testState.topicName,
  };

  // Hide test page, show results
  document.getElementById('testPage').style.display = 'none';
  document.getElementById('resultsPage').style.display = '';
  renderResults();
  document.getElementById('resultsPage').scrollIntoView({ behavior: 'smooth' });
}

function renderResults() {
  const container = document.getElementById('resultsContainer');
  if (!container) return;
  const r = window._lastResults;
  if (!r) {
    container.innerHTML = '<p>No results available.</p>';
    return;
  }
  const passed = r.score >= 60;
  container.innerHTML = `
    <h2>${r.topic} Quiz Results</h2>
    <div class="score-circle ${passed ? '' : 'fail'}">${r.score}%</div>
    <p style="font-weight:600;">${passed ? '🎉 Great job!' : '💪 Keep practicing!'}</p>
    <div class="stats-row">
      <div class="stat-item"><span class="val" style="color:#16a34a;">${r.correct}</span><span class="lbl">Correct</span></div>
      <div class="stat-item"><span class="val" style="color:#d32f2f;">${r.incorrect}</span><span class="lbl">Incorrect</span></div>
      <div class="stat-item"><span class="val" style="color:#888;">${r.skipped}</span><span class="lbl">Skipped</span></div>
      <div class="stat-item"><span class="val">${r.time}</span><span class="lbl">Time</span></div>
    </div>
    <div class="review-list">
      <h3 style="text-align:left; margin-bottom:0.5rem;">Question Review</h3>
      ${r.review.map((ri, i) => `
        <div class="review-item ${ri.isCorrect ? 'correct' : 'incorrect'}">
          <strong>Q${i + 1}:</strong> ${ri.q}<br>
          <small>Your answer: ${ri.user} | Correct: ${ri.correctAns}</small>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:1.5rem; display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="resetToHome()">Back to Topics</button>
    </div>
  `;
}

function resetToHome() {
  // Show all sections again
  document.querySelectorAll('.section:not(.test-page):not(.results-page)').forEach(s => s.style.display = '');
  document.getElementById('testPage').style.display = 'none';
  document.getElementById('resultsPage').style.display = 'none';
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}
