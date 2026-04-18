HH.injectNav('explore', '../');
HH.injectFooter();

const list = document.getElementById('reqList');

function tagClass(urg, status) {
  return {
    urg: urg === 'High' ? 'tag-high' : urg === 'Medium' ? 'tag-med' : 'tag-low',
    status: status === 'Solved' ? 'tag-solved' : 'tag-open'
  };
}

function render(filtered) {
  if (!filtered.length) {
    list.innerHTML = `<div class="card" style="text-align:center;color:var(--text-muted)">No requests match these filters yet.</div>`;
    return;
  }
  list.innerHTML = filtered.map(r => {
    const c = tagClass(r.urgency, r.status);
    const skillTags = (r.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <article class="req-card">
        <div class="req-tags">
          <span class="tag">${r.category}</span>
          <span class="tag ${c.urg}">${r.urgency}</span>
          <span class="tag ${c.status}">${r.status}</span>
        </div>
        <h3 class="req-title">${r.title}</h3>
        <p class="req-desc">${HH.Ai.summarize(r.description, 24)}</p>
        ${skillTags ? `<div class="req-tags">${skillTags}</div>` : ''}
        <div class="req-foot">
          <div class="req-author">
            <strong>${r.author}</strong>
            <span>${r.location} · ${r.helpers} helper${r.helpers === 1 ? '' : 's'} interested</span>
          </div>
          <button class="btn btn-pill-light">Open details</button>
        </div>
      </article>`;
  }).join('');
}

function applyFilters() {
  const cat = document.getElementById('fCategory').value.toLowerCase();
  const urg = document.getElementById('fUrgency').value.toLowerCase();
  const sk  = document.getElementById('fSkills').value.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const loc = document.getElementById('fLocation').value.toLowerCase();

  const filtered = HH.Store.getRequests().filter(r => {
    if (cat && r.category.toLowerCase() !== cat) return false;
    if (urg && r.urgency.toLowerCase()  !== urg) return false;
    if (loc && !r.location.toLowerCase().includes(loc)) return false;
    if (sk.length) {
      const tagStr = (r.tags || []).join(' ').toLowerCase();
      if (!sk.some(s => tagStr.includes(s))) return false;
    }
    return true;
  });
  render(filtered);
}

document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', () => {
  ['fCategory','fUrgency','fSkills','fLocation'].forEach(id => document.getElementById(id).value = '');
  render(HH.Store.getRequests());
});

document.getElementById('qSubmit').addEventListener('click', () => {
  const title = document.getElementById('qTitle').value.trim();
  const desc  = document.getElementById('qDesc').value.trim();
  const hint  = document.getElementById('qHint');
  if (!title || !desc) { hint.textContent = 'Add a title and a description first.'; return; }
  const text = title + ' ' + desc;
  HH.Store.addRequest({
    title,
    description: desc,
    category: HH.Ai.detectCategory(text),
    urgency:  HH.Ai.detectUrgency(text),
    tags:     HH.Ai.suggestTags(text),
    author:   'You',
    location: 'Remote'
  });
  document.getElementById('qTitle').value = '';
  document.getElementById('qDesc').value  = '';
  hint.textContent = 'Published — AI auto-tagged your request.';
  render(HH.Store.getRequests());
});

render(HH.Store.getRequests());
