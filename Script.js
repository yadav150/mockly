/*********************************************
 * Mockly Frontend Logic
 * Firebase Auth, dynamic grids, quiz engine
 *********************************************/

// Sample Data (same as before)
const topicsData = [
  { id:1,name:'JavaScript',icon:'📜',count:120,difficulty:'Medium' },
  { id:2,name:'Python',icon:'🐍',count:150,difficulty:'Easy' },
  { id:3,name:'Data Structures',icon:'📊',count:200,difficulty:'Hard' },
  { id:4,name:'React',icon:'⚛️',count:90,difficulty:'Medium' },
  { id:5,name:'SQL',icon:'🗃️',count:110,difficulty:'Easy' },
  { id:6,name:'Operating Systems',icon:'💻',count:95,difficulty:'Hard' },
  { id:7,name:'System Design',icon:'🏗️',count:60,difficulty:'Hard' },
  { id:8,name:'Node.js',icon:'🟢',count:85,difficulty:'Medium' },
];
const mockTestsData = [
  { id:1,name:'JavaScript Advanced',topic:'JavaScript',questions:30,duration:30,difficulty:'Hard' },
  { id:2,name:'Python Basics',topic:'Python',questions:25,duration:25,difficulty:'Easy' },
  { id:3,name:'DSA Mastery',topic:'Data Structures',questions:40,duration:45,difficulty:'Hard' },
  { id:4,name:'React Components',topic:'React',questions:20,duration:20,difficulty:'Medium' },
  { id:5,name:'SQL Query Challenge',topic:'SQL',questions:35,duration:35,difficulty:'Medium' },
  { id:6,name:'Node.js Backend',topic:'Node.js',questions:28,duration:30,difficulty:'Medium' },
];
const leaderboardData = [
  { rank:1,name:'Arjun Sharma',exam:'JavaScript Advanced',score:98.5 },
  { rank:2,name:'Priya Patel',exam:'Python Basics',score:96.2 },
  { rank:3,name:'Rohan Gupta',exam:'DSA Mastery',score:94.8 },
  { rank:4,name:'Sneha Reddy',exam:'React Components',score:92.1 },
  { rank:5,name:'Vikram Singh',exam:'SQL Query Challenge',score:90.7 },
];
const testimonialsData = [
  { quote:'Mockly helped me crack my JavaScript interview!',author:'Amit K.',role:'Frontend Developer',stars:5 },
  { quote:'The leaderboard keeps me motivated every day.',author:'Neha S.',role:'CS Student',stars:5 },
  { quote:'Clean interface, exactly what I needed.',author:'Rahul M.',role:'Data Analyst',stars:4 },
];
const examNames = [
  'SSC GD','ADRE 2.0','Assam Police','SSC MTS','SSC CGL',
  'SSC CHSL','RRB NTPC','RRB Group D','RRB ALP','APSC Prelims','UPSC Prelims'
];
const questionBank = [
  { q:'What does `typeof` return for an array?', options:['"array"','"object"','"list"','"undefined"'], correct:1 },
  { q:'Which method adds to end of array?', options:['push()','pop()','shift()','unshift()'], correct:0 },
  { q:'Output of 2 + "2" in JS?', options:['4','"22"','22','TypeError'], correct:1 },
  { q:'Keyword for constant?', options:['var','let','const','static'], correct:2 },
  { q:'JSON.parse() does?', options:['Object to JSON','JSON to object','Validate','Compress'], correct:1 },
  { q:'Python list vs tuple?', options:['Mutable/Immutable','Both mutable','Both immutable','None'], correct:0 },
  { q:'Binary search complexity?', options:['O(n)','O(log n)','O(n²)','O(1)'], correct:1 },
  { q:'React hook for state?', options:['useState','useEffect','useContext','useReducer'], correct:0 },
];

let testState = {
  active:false, questions:[], currentIndex:0, answers:{},
  timerSeconds:0, timerInterval:null, topicName:'', totalQuestions:0, totalTime:0,
};

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded',()=>{
  renderTopics();
  renderMockTests();
  renderExams();
  renderLeaderboard();
  renderTestimonials();
  setupSearch();
  setupSmoothScroll();
  setupModal();
  setupMobileMenu();
  if(typeof initAuthListener==='function') initAuthListener(updateUIForAuth);
});

// ========== RENDER FUNCTIONS ==========
function getBadge(diff){ const cls = diff==='Easy'?'badge-easy':diff==='Medium'?'badge-medium':'badge-hard'; return `<span class="badge ${cls}">${diff}</span>`; }

function renderTopics(){
  const grid=document.getElementById('topicsGrid'); if(!grid)return;
  grid.innerHTML = topicsData.map(t=>`
    <div class="topic-card" data-topic-id="${t.id}">
      <div class="topic-icon">${t.icon}</div><h3>${t.name}</h3>
      <p class="meta">${t.count} questions · ${getBadge(t.difficulty)}</p>
      <button class="btn btn-primary btn-full start-topic-btn">Start Practice</button>
    </div>`).join('');
  document.querySelectorAll('.start-topic-btn').forEach(b=>b.addEventListener('click',(e)=>{
    const id=parseInt(e.target.closest('.topic-card').dataset.topicId);
    const topic=topicsData.find(t=>t.id===id);
    if(topic) startTest(topic.name, Math.min(topic.count,15), 10);
  }));
}

function renderMockTests(){
  const grid=document.getElementById('mocktestsGrid'); if(!grid)return;
  grid.innerHTML = mockTestsData.map(mt=>`
    <div class="mocktest-card" data-test-id="${mt.id}">
      <h3>${mt.name}</h3>
      <p class="meta">📝 ${mt.questions} Q · ⏱️ ${mt.duration} min · ${getBadge(mt.difficulty)}</p>
      <p class="meta">📂 ${mt.topic}</p>
      <button class="btn btn-primary btn-full start-mock-btn">Start Test</button>
    </div>`).join('');
  document.querySelectorAll('.start-mock-btn').forEach(b=>b.addEventListener('click',(e)=>{
    const id=parseInt(e.target.closest('.mocktest-card').dataset.testId);
    const test=mockTestsData.find(mt=>mt.id===id);
    if(test) startTest(test.name, test.questions, test.duration);
  }));
}

function renderExams(){
  const grid=document.getElementById('examsGrid'); if(!grid)return;
  grid.innerHTML = examNames.map(name=>`<div class="exam-card">${name}</div>`).join('');
}

function renderLeaderboard(){
  const tbody=document.getElementById('leaderboardBody'); if(!tbody)return;
  tbody.innerHTML = leaderboardData.map(lb=>{
    const rc = lb.rank===1?'gold':lb.rank===2?'silver':lb.rank===3?'bronze':'';
    return `<tr><td class="rank ${rc}">#${lb.rank}</td><td><strong>${lb.name}</strong></td><td>${lb.exam}</td><td>${lb.score}%</td></tr>`;
  }).join('');
}

function renderTestimonials(){
  const grid=document.getElementById('testimonialsGrid'); if(!grid)return;
  grid.innerHTML = testimonialsData.map(t=>`
    <div class="testimonial-card">
      <div class="stars">${'★'.repeat(t.stars)}${'☆'.repeat(5-t.stars)}</div>
      <p class="quote">"${t.quote}"</p>
      <p class="author">${t.author}</p><p class="author-role">${t.role}</p>
    </div>`).join('');
}

// ========== SEARCH ==========
function setupSearch(){
  const inp=document.getElementById('searchInput'), btn=document.getElementById('searchBtn'), noRes=document.getElementById('noResults');
  function filter(){
    const q=inp.value.trim().toLowerCase();
    let vis=false;
    document.querySelectorAll('.topic-card,.mocktest-card,.exam-card').forEach(c=>{
      if(!q || c.textContent.toLowerCase().includes(q)){ c.style.display=''; vis=true; }
      else c.style.display='none';
    });
    noRes.classList.toggle('visible',!vis&&q!=='');
  }
  inp.addEventListener('input',filter);
  btn.addEventListener('click',filter);
}

// ========== SMOOTH SCROLL ==========
function setupSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',function(e){
    e.preventDefault();
    const id=this.getAttribute('href').substring(1);
    const el=document.getElementById(id);
    if(el){ el.scrollIntoView({behavior:'smooth'}); history.pushState(null,null,`#${id}`); }
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('hamburger').classList.remove('open');
  }));
}

// ========== MOBILE MENU ==========
function setupMobileMenu(){
  const ham=document.getElementById('hamburger'), menu=document.getElementById('mobileMenu');
  ham.addEventListener('click',()=>{ ham.classList.toggle('open'); menu.classList.toggle('active'); });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ ham.classList.remove('open'); menu.classList.remove('active'); }));
}

// ========== MODAL + FIREBASE AUTH ==========
function setupModal(){
  const overlay=document.getElementById('modalOverlay'),
        btnLogin=document.getElementById('btnLogin'), btnSignup=document.getElementById('btnSignup'),
        btnLoginM=document.getElementById('btnLoginMobile'), btnSignupM=document.getElementById('btnSignupMobile'),
        closeBtn=document.getElementById('modalClose'),
        switchSignup=document.getElementById('switchToSignup'), switchLogin=document.getElementById('switchToLogin'),
        loginForm=document.getElementById('loginForm'), signupForm=document.getElementById('signupForm'),
        loginSubmit=document.getElementById('loginSubmitBtn'), signupSubmit=document.getElementById('signupSubmitBtn'),
        googleLogin=document.getElementById('googleSignInBtn'), googleSignup=document.getElementById('googleSignUpBtn');

  function openModal(type='login'){
    overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    if(type==='login'){ loginForm.style.display=''; signupForm.style.display='none'; document.getElementById('modalTitle').textContent='Login'; }
    else { loginForm.style.display='none'; signupForm.style.display=''; signupForm.querySelector('h3').textContent='Sign Up'; }
  }
  function closeModal(){
    overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true');
    ['loginEmail','loginPassword','signupName','signupEmail','signupPassword'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  }

  btnLogin.addEventListener('click',()=>openModal('login'));
  btnSignup.addEventListener('click',()=>openModal('signup'));
  btnLoginM.addEventListener('click',()=>openModal('login'));
  btnSignupM.addEventListener('click',()=>openModal('signup'));
  closeBtn.addEventListener('click',closeModal);
  overlay.addEventListener('click',e=>{ if(e.target===overlay) closeModal(); });

  switchSignup.addEventListener('click',()=>{ loginForm.style.display='none'; signupForm.style.display=''; signupForm.querySelector('h3').textContent='Sign Up'; });
  switchLogin.addEventListener('click',()=>{ signupForm.style.display='none'; loginForm.style.display=''; document.getElementById('modalTitle').textContent='Login'; });

  // Email/Password Login
  loginSubmit.addEventListener('click',async()=>{
    const email=document.getElementById('loginEmail').value.trim(), pass=document.getElementById('loginPassword').value.trim();
    if(!email||!pass) return alert('Please fill all fields.');
    try{ await loginUser(email,pass); closeModal(); }catch(e){ alert('Login failed: '+e.message); }
  });
  // Email/Password Signup
  signupSubmit.addEventListener('click',async()=>{
    const name=document.getElementById('signupName').value.trim(), email=document.getElementById('signupEmail').value.trim(), pass=document.getElementById('signupPassword').value.trim();
    if(!name||!email||!pass) return alert('All fields required.');
    if(pass.length<8) return alert('Password must be at least 8 characters.');
    try{ await signupUser(email,pass,name); closeModal(); }catch(e){ alert('Signup failed: '+e.message); }
  });
  // Google Sign-In
  async function googleAuth(){
    try{ await signInWithGoogle(); closeModal(); }catch(e){ alert('Google sign-in failed: '+e.message); }
  }
  googleLogin.addEventListener('click',googleAuth);
  googleSignup.addEventListener('click',googleAuth);
}

// ========== UI UPDATE ON AUTH STATE ==========
function updateUIForAuth(user){
  const navActions=document.querySelector('.nav-actions'), mobileActions=document.querySelector('.mobile-actions');
  if(!navActions||!mobileActions) return;
  if(user){
    navActions.innerHTML = `<button class="btn btn-outline" id="btnDashboard">Dashboard</button><button class="btn btn-primary" id="btnLogout">Logout</button>`;
    mobileActions.innerHTML = `<button class="btn btn-outline" id="btnDashboardM">Dashboard</button><button class="btn btn-primary" id="btnLogoutM">Logout</button>`;
    document.getElementById('btnLogout').addEventListener('click',()=>logoutUser());
    document.getElementById('btnLogoutM').addEventListener('click',()=>logoutUser());
  } else {
    navActions.innerHTML = `<button class="btn btn-outline" id="btnLogin">Login</button><button class="btn btn-primary" id="btnSignup">Sign Up</button>`;
    mobileActions.innerHTML = `<button class="btn btn-outline" id="btnLoginMobile">Login</button><button class="btn btn-primary" id="btnSignupMobile">Sign Up</button>`;
    // Rebind modal openers because buttons are new
    document.getElementById('btnLogin').addEventListener('click',()=>document.getElementById('modalOverlay').classList.add('active'));
    document.getElementById('btnSignup').addEventListener('click',()=>document.getElementById('modalOverlay').classList.add('active'));
    document.getElementById('btnLoginMobile').addEventListener('click',()=>document.getElementById('modalOverlay').classList.add('active'));
    document.getElementById('btnSignupMobile').addEventListener('click',()=>document.getElementById('modalOverlay').classList.add('active'));
  }
}

// ========== TEST ENGINE (same as before) ==========
function startTest(name,total,dur){
  const qs=[];
  for(let i=0;i<total;i++){ const q=questionBank[i%questionBank.length]; qs.push({...q,options:[...q.options]}); }
  testState={ active:true, questions:qs, currentIndex:0, answers:{}, timerSeconds:dur*60, timerInterval:null, topicName:name, totalQuestions:total, totalTime:dur*60 };
  document.querySelectorAll('.section:not(.test-page):not(.results-page)').forEach(s=>s.style.display='none');
  document.getElementById('testPage').style.display=''; document.getElementById('resultsPage').style.display='none';
  renderTestQuestion(); startTimer(); document.getElementById('testPage').scrollIntoView({behavior:'smooth'});
}
function startTimer(){
  clearInterval(testState.timerInterval);
  testState.timerInterval=setInterval(()=>{
    testState.timerSeconds--;
    updateTimerDisplay();
    if(testState.timerSeconds<=0){ clearInterval(testState.timerInterval); submitTest(); }
  },1000);
}
function updateTimerDisplay(){
  const el=document.getElementById('testTimer'); if(!el)return;
  const m=Math.floor(testState.timerSeconds/60), s=testState.timerSeconds%60;
  el.textContent=`${m}:${s.toString().padStart(2,'0')}`;
  el.classList.toggle('warning',testState.timerSeconds<60);
}
function formatTime(sec){ const m=Math.floor(sec/60),s=sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }
function renderTestQuestion(){
  const c=document.getElementById('testContainer'); if(!c)return;
  const i=testState.currentIndex, q=testState.questions[i], prog=((i+1)/testState.totalQuestions)*100, sel=testState.answers[i];
  c.innerHTML=`
    <div class="test-header"><span class="test-title">${testState.topicName}</span><span class="timer" id="testTimer">${formatTime(testState.timerSeconds)}</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div>
    <div class="q-num">Question ${i+1} of ${testState.totalQuestions}</div>
    <div class="q-text">${q.q}</div>
    <ul class="options-list">${q.options.map((opt,oi)=>`<li class="${sel===oi?'selected':''}" onclick="selectAnswer(${oi})">${String.fromCharCode(65+oi)}. ${opt}</li>`).join('')}</ul>
    <div class="test-nav">
      <button class="btn btn-prev" ${i===0?'disabled':''} onclick="prevQuestion()">← Prev</button>
      <span>${i+1}/${testState.totalQuestions}</span>
      ${i<testState.totalQuestions-1?'<button class="btn btn-next" onclick="nextQuestion()">Next →</button>':'<button class="btn btn-submit" onclick="submitTest()">Submit</button>'}
    </div>`;
  updateTimerDisplay();
}
function selectAnswer(oi){ testState.answers[testState.currentIndex]=oi; renderTestQuestion(); }
function nextQuestion(){ if(testState.currentIndex<testState.totalQuestions-1){ testState.currentIndex++; renderTestQuestion(); } }
function prevQuestion(){ if(testState.currentIndex>0){ testState.currentIndex--; renderTestQuestion(); } }
function submitTest(){
  clearInterval(testState.timerInterval); testState.active=false;
  let correct=0,incorrect=0,skipped=0,review=[];
  testState.questions.forEach((q,i)=>{
    const u=testState.answers[i], isCorrect=u===q.correct;
    if(u===undefined||u===null){ skipped++; review.push({q:q.q,user:'Not answered',correctAns:q.options[q.correct],isCorrect:false}); }
    else if(isCorrect){ correct++; review.push({q:q.q,user:q.options[u],correctAns:q.options[q.correct],isCorrect:true}); }
    else { incorrect++; review.push({q:q.q,user:q.options[u],correctAns:q.options[q.correct],isCorrect:false}); }
  });
  const score=Math.round((correct/testState.totalQuestions)*100);
  const timeTaken=testState.totalTime-testState.timerSeconds;
  window._lastResults={score,correct,incorrect,skipped,total:testState.totalQuestions,time:`${Math.floor(timeTaken/60)}m ${timeTaken%60}s`,review,topic:testState.topicName};
  document.getElementById('testPage').style.display='none'; document.getElementById('resultsPage').style.display='';
  renderResults(); document.getElementById('resultsPage').scrollIntoView({behavior:'smooth'});
}
function renderResults(){
  const c=document.getElementById('resultsContainer'); if(!c)return;
  const r=window._lastResults; if(!r){ c.innerHTML='<p>No results.</p>'; return; }
  const passed=r.score>=60;
  c.innerHTML=`
    <h2>${r.topic} Results</h2>
    <div class="score-circle ${passed?'':'fail'}">${r.score}%</div>
    <p style="font-weight:600;">${passed?'🎉 Great job!':'💪 Keep practicing!'}</p>
    <div class="stats-row">
      <div class="stat-item"><span class="val" style="color:#16a34a;">${r.correct}</span><span class="lbl">Correct</span></div>
      <div class="stat-item"><span class="val" style="color:#d32f2f;">${r.incorrect}</span><span class="lbl">Incorrect</span></div>
      <div class="stat-item"><span class="val" style="color:#888;">${r.skipped}</span><span class="lbl">Skipped</span></div>
      <div class="stat-item"><span class="val">${r.time}</span><span class="lbl">Time</span></div>
    </div>
    <div class="review-list"><h3 style="text-align:left;margin-bottom:0.5rem;">Review</h3>${r.review.map((ri,i)=>`<div class="review-item ${ri.isCorrect?'correct':'incorrect'}"><strong>Q${i+1}:</strong> ${ri.q}<br><small>Your: ${ri.user} | Correct: ${ri.correctAns}</small></div>`).join('')}</div>
    <div style="margin-top:1.5rem;"><button class="btn btn-primary" onclick="resetToHome()">Back to Topics</button></div>`;
}
function resetToHome(){
  document.querySelectorAll('.section:not(.test-page):not(.results-page)').forEach(s=>s.style.display='');
  document.getElementById('testPage').style.display='none'; document.getElementById('resultsPage').style.display='none';
  document.getElementById('home').scrollIntoView({behavior:'smooth'});
}
