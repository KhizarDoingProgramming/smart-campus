function getEvents(callback) {
  fetch('php/get_events.php')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('sc_events', JSON.stringify(data));
      if (callback) callback(data);
    })
    .catch(err => {
      const stored = localStorage.getItem('sc_events');
      if (stored && callback) callback(JSON.parse(stored));
    });
}

function renderEvents(filter = '', category = 'All') {
  getEvents(function(events) {
    const container = document.getElementById('eventsGrid');
    if (!container) return;
    const filtered = events.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(filter.toLowerCase()) ||
                          ev.description.toLowerCase().includes(filter.toLowerCase());
      const matchCat = category === 'All' || ev.category === category;
      return matchSearch && matchCat;
    });
    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text2)"><div style="font-size:3rem;margin-bottom:1rem">🔍</div><p>No events found.</p></div>`;
      return;
    }
    const user = getCurrentUser();
    container.innerHTML = filtered.map(ev => {
      const isRegistered = false; 
      const isFull = ev.seats <= 0;
      return `
      <div class="event-card" id="ev-${ev.id}">
        <div class="event-card-top" style="background:${ev.color}22">
          <span>📅</span>
          <div class="ev-cat-badge" style="position:absolute;top:1rem;right:1rem;background:${ev.color}33;color:${ev.color};padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600">${ev.category}</div>
        </div>
        <div class="event-card-body">
          <h3>${ev.title}</h3>
          <p>${ev.description || ''}</p>
          <div class="event-meta">
            <span><i class="fas fa-calendar"></i> ${ev.date}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${ev.location}</span>
          </div>
          <div class="event-actions">
            ${isFull ? `<span style="color:var(--accent);font-size:0.8rem;font-weight:600">🚫 Full</span>` : `<button class="btn-sm" onclick="registerEvent(${ev.id})">Register →</button>`}
          </div>
        </div>
      </div>`;
    }).join('');
  });
}

function registerEvent(eventId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('🔐 Please login!', 'error');
    return;
  }
  showToast('✅ Successfully registered!', 'success');
}

function triggerConfetti() {
  const colors = ['#6C63FF', '#FF6B6B', '#43E97B', '#F7971E', '#A855F7'];
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `position:fixed; top:${Math.random()*40}%; left:${Math.random()*100}%; width:8px; height:8px; border-radius:50%; background:${colors[Math.floor(Math.random()*colors.length)]}; z-index:9999; pointer-events:none; animation: confettiFall 1.5s ease-out forwards;`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1600);
  }
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `@keyframes confettiFall { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(200px) rotate(720deg); opacity:0; } }`;
document.head.appendChild(confettiStyle);

window.addEventListener('load', () => {
  renderEvents();
});