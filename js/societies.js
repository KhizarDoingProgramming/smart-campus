function getSocieties(callback) {
  fetch('php/get_societies.php')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('sc_societies', JSON.stringify(data));
      if (callback) callback(data);
    })
    .catch(err => {
      const stored = localStorage.getItem('sc_societies');
      if (stored && callback) callback(JSON.parse(stored));
    });
}
function renderSocieties(filter = '', category = 'All') {
  getSocieties(function(societies) {
    const container = document.getElementById('societiesGrid');
    if (!container) return;
    const filtered = societies.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(filter.toLowerCase()) ||
                          s.description.toLowerCase().includes(filter.toLowerCase());
      const matchCat = category === 'All' || s.category === category;
      return matchSearch && matchCat;
    });
    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text2)"><div style="font-size:3rem">🔍</div><p style="margin-top:1rem">No societies found.</p></div>`;
      return;
    }
    const user = getCurrentUser();
    container.innerHTML = filtered.map(s => {
      const isJoined = false;
      return `
      <div class="society-card">
        <div class="society-icon" style="background:${s.color}22"><span>🎓</span></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">
          <h3 style="font-family:'Syne',sans-serif;color:var(--white)">${s.name}</h3>
          <span style="font-size:0.72rem;background:${s.color}22;color:${s.color};padding:2px 8px;border-radius:50px;font-weight:600;white-space:nowrap">${s.category}</span>
        </div>
        <p>${s.description}</p>
        <div class="society-stats">
          <div class="society-stat"><strong>${s.members}</strong><small>Members</small></div>
        </div>
        <button class="btn-sm" style="width:100%;padding:0.6rem;font-size:0.9rem" onclick="joinSociety(${s.id})">Join Society →</button>
      </div>`;
    }).join('');
  });
}
function joinSociety(id) {
  const user = getCurrentUser();
  if (!user) {
    showToast('🔐 Please login!', 'error');
    return;
  }
  showToast('🎉 Joined successfully!', 'success');
}
window.addEventListener('load', () => {
  renderSocieties();
});