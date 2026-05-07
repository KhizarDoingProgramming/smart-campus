function initUsers() {
  if (!localStorage.getItem('sc_users')) {
    var defaultUsers = [
      { name:"Ali Hassan", email:"ali@campus.edu", password:"ali123", dept:"Computer Science", rollNo:"CS-2021-01", bio:"" },
      { name:"Sara Khan",  email:"sara@campus.edu", password:"sara123", dept:"Software Engineering", rollNo:"SE-2021-02", bio:"" }
    ];
    localStorage.setItem('sc_users', JSON.stringify(defaultUsers));
  }
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem('sc_users')) || []; }
  catch(e) { return []; }
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('sc_currentUser')) || null; }
  catch(e) { return null; }
}
function loginUser() {
  var emailEl = document.getElementById('loginEmail');
  var passEl  = document.getElementById('loginPassword');
  var errorEl = document.getElementById('loginError');
  if (!emailEl || !passEl || !errorEl) { return; }
  var email    = emailEl.value.trim();
  var password = passEl.value.trim();
  errorEl.style.display = 'none';
  errorEl.textContent   = '';
  if (!email || !password) {
    errorEl.textContent   = '⚠️ Email and password are required.';
    errorEl.style.display = 'block';
    return;
  }
  fetch('php/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('sc_currentUser', JSON.stringify(data.user));
      showToast('✅ Welcome, ' + data.user.name + '!', 'success');
      setTimeout(function() { window.location.href = 'dashboard.html'; }, 1000);
    } else {
      errorEl.textContent   = '❌ ' + data.message;
      errorEl.style.display = 'block';
      shakeCard();
    }
  })
  .catch(err => {
    errorEl.textContent = '❌ Server error. Make sure XAMPP is running.';
    errorEl.style.display = 'block';
  });
}
function registerUser() {
  var nameEl  = document.getElementById('regName');
  var emailEl = document.getElementById('regEmail');
  var deptEl  = document.getElementById('regDept');
  var passEl  = document.getElementById('regPassword');
  var errorEl = document.getElementById('regError');
  var succEl  = document.getElementById('regSuccess');
  if (!nameEl || !emailEl || !deptEl || !passEl) { return; }
  var name     = nameEl.value.trim();
  var email    = emailEl.value.trim();
  var dept     = deptEl.value.trim();
  var password = passEl.value.trim();
  errorEl.style.display = 'none';
  succEl.style.display  = 'none';
  if (!name) { errorEl.textContent = '⚠️ Enter your name.'; errorEl.style.display = 'block'; return; }
  if (!email || !email.includes('@')) { errorEl.textContent = '⚠️ Enter a valid email.'; errorEl.style.display = 'block'; return; }
  if (!dept) { errorEl.textContent = '⚠️ Select a department.'; errorEl.style.display = 'block'; return; }
  if (!password || password.length < 6) { errorEl.textContent = '⚠️ Password must be at least 6 characters.'; errorEl.style.display = 'block'; return; }
  var rollNo = generateRollNo(dept);
  fetch('php/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email, password: password, dept: dept, rollNo: rollNo })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      succEl.textContent   = '✅ Account created! Roll No: ' + rollNo;
      succEl.style.display = 'block';
      showToast('🎉 Registration successful!', 'success');
      nameEl.value = ''; emailEl.value = ''; deptEl.value = ''; passEl.value = '';
      setTimeout(function() { switchTab('login'); }, 2000);
    } else {
      errorEl.textContent = '❌ ' + data.message;
      errorEl.style.display = 'block';
    }
  })
  .catch(err => {
    errorEl.textContent = '❌ Server error.';
    errorEl.style.display = 'block';
  });
}
function logoutUser() {
  localStorage.removeItem('sc_currentUser');
  showToast('👋 Logged out!', 'success');
  setTimeout(function() { window.location.href = 'index.html'; }, 800);
}
function switchTab(tab) {
  var lf = document.getElementById('loginForm');
  var rf = document.getElementById('registerForm');
  var lt = document.getElementById('loginTab');
  var rt = document.getElementById('registerTab');
  if (!lf || !rf) return;
  if (tab === 'login') {
    lf.style.display = 'block'; rf.style.display = 'none';
    if (lt) lt.classList.add('active');
    if (rt) rt.classList.remove('active');
  } else {
    lf.style.display = 'none'; rf.style.display = 'block';
    if (rt) rt.classList.add('active');
    if (lt) lt.classList.remove('active');
  }
}
function togglePassword() {
  var inp  = document.getElementById('loginPassword');
  var icon = document.getElementById('togglePass');
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
  } else {
    inp.type = 'password';
    if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
  }
}
function scrollToLogin() {
  var el = document.getElementById('authSection');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function checkLoginState() {
  var user        = getCurrentUser();
  var loginBtn    = document.getElementById('loginNavBtn');
  var logoutBtn   = document.getElementById('logoutNavBtn');
  var userNav     = document.getElementById('loggedUserNav');
  var profileLink = document.getElementById('navProfile');
  if (user) {
    if (loginBtn)    loginBtn.style.display    = 'none';
    if (logoutBtn)   logoutBtn.style.display   = 'block';
    if (userNav)     { userNav.textContent = '👋 ' + user.name.split(' ')[0]; userNav.style.display = 'block'; }
    if (profileLink) profileLink.style.display = 'block';
  } else {
    if (loginBtn)    loginBtn.style.display    = 'block';
    if (logoutBtn)   logoutBtn.style.display   = 'none';
    if (userNav)     userNav.style.display     = 'none';
    if (profileLink) profileLink.style.display = 'none';
  }
}
function generateRollNo(dept) {
  var map = { 'Computer Science':'CS', 'Software Engineering':'SE', 'Electrical Engineering':'EE', 'Business Administration':'BA', 'Mathematics':'MATH' };
  var prefix = map[dept] || 'STD';
  return prefix + '-' + new Date().getFullYear() + '-' + (Math.floor(Math.random()*900)+100);
}
function shakeCard() {
  var card = document.getElementById('authCard');
  if (!card) return;
  card.style.animation = 'none';
  setTimeout(function() { card.style.animation = 'shake 0.4s ease'; }, 10);
  setTimeout(function() { card.style.animation = 'none'; }, 450);
}
function showToast(msg, type) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = 'toast ' + (type||'success') + ' show';
  setTimeout(function() { toast.classList.remove('show'); }, 3200);
}
function addActivity(text, icon, color) {
  try {
    var acts = JSON.parse(localStorage.getItem('sc_activities')) || [];
    acts.unshift({ text:text, icon:icon, color:color, date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) });
    localStorage.setItem('sc_activities', JSON.stringify(acts.slice(0,15)));
  } catch(e) {}
}
(function(){
  var s = document.createElement('style');
  s.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}';
  document.head.appendChild(s);
})();
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var lf = document.getElementById('loginForm');
  var rf = document.getElementById('registerForm');
  if (lf && lf.style.display !== 'none') loginUser();
  else if (rf && rf.style.display !== 'none') registerUser();
});
window.addEventListener('load', function() {
  checkLoginState();
});