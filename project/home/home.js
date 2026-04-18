HH.injectNav('home', '../');
HH.injectFooter();

(function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  const featured = HH.Store.getRequests().slice(0, 3);
  grid.innerHTML = featured.map(r => {
    const urg = r.urgency === 'High' ? 'tag-high' : r.urgency === 'Medium' ? 'tag-med' : 'tag-low';
    const stat = r.status === 'Solved' ? 'tag-solved' : 'tag-open';
    return `
      <article class="card req-card">
        <div class="req-tags">
          <span class="tag">${r.category}</span>
          <span class="tag ${urg}">${r.urgency}</span>
          <span class="tag ${stat}">${r.status}</span>
        </div>
        <h3 class="req-title">${r.title}</h3>
        <p class="req-desc">${HH.Ai.summarize(r.description, 18)}</p>
        <div class="req-foot">
          <div class="req-author">
            <strong>${r.author}</strong>
            <span>${r.location} · ${r.helpers} helper${r.helpers === 1 ? '' : 's'} interested</span>
          </div>
          <a class="btn btn-pill-light" href="../explore/explore.html">Open details</a>
        </div>
      </article>`;
  }).join('');
})();
