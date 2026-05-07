function loadProfile() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  const avatar = document.getElementById('profileAvatar');
  if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileDept').textContent = user.dept || 'N/A';
  document.getElementById('profileRoll').textContent = user.rollNo || 'N/A';
  document.getElementById('editName').value = user.name || '';
  document.getElementById('editEmail').value = user.email || '';
  document.getElementById('editDept').value = user.dept || '';
  document.getElementById('editRoll').value = user.rollNo || '';
  document.getElementById('editBio').value = user.bio || '';
  const userEvents = getUserEvents();
  const userSocieties = getUserSocieties();
  const activities = JSON.parse(localStorage.getItem('sc_activities')) || [];
  document.getElementById('statEvents').textContent = userEvents.length;
  document.getElementById('statSocieties').textContent = userSocieties.length;
  document.getElementById('statActivities').textContent = activities.length;
  renderUserEvents(userEvents);
  renderUserSocieties(userSocieties);
  renderActivities(activities);
  renderBadges(userEvents, userSocieties);
}
function renderUserEvents(events) {
  const container = document.getElementById('userEventsList');
  if (!container) return;
  if (events.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text2)">
      <div style="font-size:2.5rem;margin-bottom:1rem">📅</div>
      <p>No events registered yet.</p>
      <button class="btn-sm" style="margin-top:1rem" onclick="window.location.href='events.html'">Browse Events</button>
    </div>`;
    return;
  }
  container.innerHTML = events.map(ev => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${ev.color}22;color:${ev.color}">
        ${ev.emoji}
      </div>
      <div class="activity-text" style="flex:1">
        <strong>${ev.title}</strong>
        <small>${ev.date} • ${ev.location}</small>
      </div>
      <span style="font-size:0.75rem;background:rgba(67,233,123,0.15);color:#43E97B;padding:3px 10px;border-radius:50px;font-weight:600">✓ Registered</span>
    </div>
  `).join('');
}
function renderUserSocieties(societies) {
  const container = document.getElementById('userSocietiesList');
  if (!container) return;
  if (societies.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text2)">
      <div style="font-size:2.5rem;margin-bottom:1rem">👥</div>
      <p>Not a member of any society yet.</p>
      <button class="btn-sm" style="margin-top:1rem" onclick="window.location.href='societies.html'">Explore Societies</button>
    </div>`;
    return;
  }
  container.innerHTML = societies.map(s => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${s.color}22;color:${s.color};font-size:1.3rem">
        ${s.emoji}
      </div>
      <div class="activity-text" style="flex:1">
        <strong>${s.name}</strong>
        <small>${s.category} • ${s.members} members</small>
      </div>
      <span style="font-size:0.75rem;background:rgba(108,99,255,0.15);color:var(--primary);padding:3px 10px;border-radius:50px;font-weight:600">Member</span>
    </div>
  `).join('');
}
function renderActivities(activities) {
  const container = document.getElementById('activityFeed');
  if (!container) return;
  if (activities.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text2)">
      <div style="font-size:2.5rem;margin-bottom:1rem">📊</div>
      <p>No activity yet. Start exploring!</p>
    </div>`;
    return;
  }
  container.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${a.color}22;color:${a.color}">${a.icon}</div>
      <div class="activity-text">
        <strong>${a.text}</strong>
        <small>${a.date}</small>
      </div>
    </div>
  `).join('');
}
function renderBadges(events, societies) {
  const container = document.getElementById('badgesContainer');
  if (!container) return;
  const allBadges = [
    { icon: '🌟', name: 'First Step', desc: 'Joined the platform', earned: true },
    { icon: '📅', name: 'Event Goer', desc: 'Registered for 1+ event', earned: events.length >= 1 },
    { icon: '🎯', name: 'Active Member', desc: 'Registered for 3+ events', earned: events.length >= 3 },
    { icon: '👥', name: 'Team Player', desc: 'Joined 1+ society', earned: societies.length >= 1 },
    { icon: '🏆', name: 'Campus Hero', desc: 'Joined 3+ societies', earned: societies.length >= 3 },
    { icon: '🚀', name: 'Explorer', desc: 'Tried everything!', earned: events.length >= 1 && societies.length >= 1 },
  ];
  container.innerHTML = allBadges.map(b => `
    <div class="badge-item" style="${!b.earned ? 'opacity:0.3;filter:grayscale(1)' : ''}">
      <span>${b.icon}</span>
      <strong>${b.name}</strong>
      <small>${b.desc}</small>
      ${b.earned ? '<span style="font-size:0.7rem;color:var(--green);font-weight:600">✓ Earned</span>' : '<span style="font-size:0.7rem;color:var(--text3)">Locked</span>'}
    </div>
  `).join('');
}
function switchProfileTab(tabName) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`ptab-${tabName}`).classList.add('active');
  document.getElementById(`section-${tabName}`).classList.add('active');
}
function saveProfile() {
  const user = getCurrentUser();
  if (!user) return;
  const updatedUser = {
    ...user,
    name: document.getElementById('editName').value.trim() || user.name,
    bio: document.getElementById('editBio').value.trim()
  };
  const users = getUsers();
  const idx = users.findIndex(u => u.email === user.email);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedUser };
    localStorage.setItem('sc_users', JSON.stringify(users));
  }
  localStorage.setItem('sc_currentUser', JSON.stringify(updatedUser));
  showToast('✅ Profile updated successfully!', 'success');
  document.getElementById('profileName').textContent = updatedUser.name;
  addActivity('Updated profile information', '✏️', '#6C63FF');
}
function changePassword() {
  const current = document.getElementById('currentPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;
  const errorEl = document.getElementById('passError');
  const successEl = document.getElementById('passSuccess');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  const user = getCurrentUser();
  if (user.password !== current) {
    errorEl.textContent = '❌ Current password is incorrect.';
    errorEl.style.display = 'block';
    return;
  }
  if (newPass.length < 6) {
    errorEl.textContent = '⚠️ New password must be at least 6 characters.';
    errorEl.style.display = 'block';
    return;
  }
  if (newPass !== confirm) {
    errorEl.textContent = '⚠️ Passwords do not match.';
    errorEl.style.display = 'block';
    return;
  }
  const users = getUsers();
  const idx = users.findIndex(u => u.email === user.email);
  users[idx].password = newPass;
  localStorage.setItem('sc_users', JSON.stringify(users));
  const updatedUser = { ...user, password: newPass };
  localStorage.setItem('sc_currentUser', JSON.stringify(updatedUser));
  successEl.textContent = '✅ Password changed successfully!';
  successEl.style.display = 'block';
  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
}