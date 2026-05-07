let selectedRating = 0;
let selectedEvent = '';
function initFeedback() {
  loadEventOptions();
  renderReviews();
  renderRatingStats();
}
function loadEventOptions() {
  const select = document.getElementById('feedbackEvent');
  if (!select) return;
  const events = getEvents ? getEvents() : [];
  events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.title;
    opt.textContent = ev.title;
    select.appendChild(opt);
  });
}
function setRating(val) {
  selectedRating = val;
  document.querySelectorAll('.star').forEach((star, idx) => {
    star.classList.toggle('active', idx < val);
  });
  document.getElementById('ratingLabel').textContent = getRatingLabel(val);
}
function getRatingLabel(val) {
  const labels = ['', '😞 Poor', '😐 Fair', '😊 Good', '😃 Great', '🤩 Excellent!'];
  return labels[val] || '';
}
function submitFeedback() {
  const user = getCurrentUser ? getCurrentUser() : null;
  if (!user) {
    showToast('🔐 Please login to submit feedback!', 'error');
    return;
  }
  const event = document.getElementById('feedbackEvent').value;
  const text = document.getElementById('feedbackText').value.trim();
  const errorEl = document.getElementById('feedbackError');
  if (!event) {
    errorEl.textContent = '⚠️ Please select an event.';
    errorEl.style.display = 'block';
    return;
  }
  if (selectedRating === 0) {
    errorEl.textContent = '⚠️ Please select a rating.';
    errorEl.style.display = 'block';
    return;
  }
  if (!text || text.length < 10) {
    errorEl.textContent = '⚠️ Please write at least 10 characters.';
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';
  const reviews = JSON.parse(localStorage.getItem('sc_reviews')) || [];
  const newReview = {
    id: Date.now(),
    event,
    reviewer: user.name,
    dept: user.dept,
    rating: selectedRating,
    text,
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
  };
  reviews.unshift(newReview);
  localStorage.setItem('sc_reviews', JSON.stringify(reviews));
  selectedRating = 0;
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
  document.getElementById('ratingLabel').textContent = '';
  document.getElementById('feedbackText').value = '';
  document.getElementById('feedbackEvent').value = '';
  showToast('✅ Feedback submitted! Thank you!', 'success');
  if (typeof addActivity === 'function') addActivity(`Reviewed "${event}"`, '⭐', '#F7971E');
  renderReviews();
  renderRatingStats();
  animateSubmit();
}
function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem('sc_reviews')) || getDefaultReviews();
  const container = document.getElementById('reviewsList');
  if (!container) return;
  if (reviews.length === 0) {
    container.innerHTML = `<p style="color:var(--text2);text-align:center;padding:2rem">No reviews yet. Be the first!</p>`;
    return;
  }
  container.innerHTML = reviews.slice(0, 8).map(r => `
    <div class="review-item">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.3rem">
        <div class="reviewer">${r.reviewer} <span style="color:var(--text3);font-weight:400;font-size:0.8rem">· ${r.dept || ''}</span></div>
        <span style="font-size:0.72rem;color:var(--text3)">${r.date}</span>
      </div>
      <div style="font-size:0.78rem;color:var(--primary);margin-bottom:0.4rem;font-weight:600">${r.event}</div>
      <div class="review-stars">${'⭐'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <div class="review-text">${r.text}</div>
    </div>
  `).join('');
}
function renderRatingStats() {
  const reviews = JSON.parse(localStorage.getItem('sc_reviews')) || getDefaultReviews();
  const container = document.getElementById('ratingStats');
  if (!container || reviews.length === 0) return;
  const total = reviews.length;
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
  const counts = [0,0,0,0,0];
  reviews.forEach(r => counts[r.rating - 1]++);
  container.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="font-family:'Syne',sans-serif;font-size:3.5rem;font-weight:800;color:var(--white)">${avg}</div>
      <div style="font-size:1.5rem;margin-bottom:0.3rem">${'⭐'.repeat(Math.round(avg))}</div>
      <div style="color:var(--text2);font-size:0.85rem">Based on ${total} review${total !== 1 ? 's' : ''}</div>
    </div>
    ${[5,4,3,2,1].map(star => {
      const count = counts[star - 1];
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
      <div style="display:flex;align-items:center;gap:0.8rem;margin-bottom:0.5rem">
        <span style="font-size:0.8rem;color:var(--text2);width:40px">${star} ⭐</span>
        <div style="flex:1;background:var(--bg2);border-radius:4px;height:8px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:var(--yellow);border-radius:4px;transition:width 0.8s ease"></div>
        </div>
        <span style="font-size:0.75rem;color:var(--text3);width:30px;text-align:right">${count}</span>
      </div>`;
    }).join('')}
  `;
}
function animateSubmit() {
  const btn = document.getElementById('submitFeedbackBtn');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '✅ Submitted!';
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 2000);
}
function getDefaultReviews() {
  const defaults = [
    { id: 1, event: "Tech Fest 2025", reviewer: "Ali Hassan", dept: "CS", rating: 5, text: "Amazing event! The hackathon was incredibly well organized and the guest speakers were inspiring.", date: "May 10, 2025" },
    { id: 2, event: "Cultural Night", reviewer: "Sara Khan", dept: "SE", rating: 4, text: "Beautiful performances. The food stalls were a great addition. Would love to see more cultural diversity.", date: "May 8, 2025" },
    { id: 3, event: "Robotics Workshop", reviewer: "Ahmed Raza", dept: "EE", rating: 5, text: "Hands-on and super engaging! Learned so much about autonomous systems. Highly recommend.", date: "May 6, 2025" },
  ];
  localStorage.setItem('sc_reviews', JSON.stringify(defaults));
  return defaults;
}