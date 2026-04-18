HH.injectNav('ai', '../');
HH.injectFooter();

const reqs = HH.Store.getRequests();
const helpers = HH.Store.getHelpers();

// Trend pulse (most common category)
const catCount = {};
reqs.forEach(r => catCount[r.category] = (catCount[r.category] || 0) + 1);
const topCat = Object.entries(catCount).sort((a,b)=>b[1]-a[1])[0];
document.getElementById('trendCat').textContent = topCat ? topCat[0] : '—';

// Urgency watch
document.getElementById('urgentCount').textContent = reqs.filter(r => r.urgency === 'High').length;

// Mentor pool (trust >= 80)
document.getElementById('mentorCount').textContent = helpers.filter(h => h.trust >= 80).length;

// Recommendations: open + high/medium urgency
const recs = reqs.filter(r => r.status !== 'Solved').slice(0, 6);
const fallback = recs.length ? recs : reqs.slice(0, 4);

document.getElementById('recList').innerHTML = fallback.map(r => {
  const urg = r.urgency === 'High' ? 'tag-high' : r.urgency === 'Medium' ? 'tag-med' : 'tag-low';
  return `
    <div class="rec-row">
      <strong>${r.title}</strong>
      <p>AI summary: ${HH.Ai.summarize(r.description, 22)}</p>
      <div class="req-tags">
        <span class="tag">${r.category}</span>
        <span class="tag ${urg}">${r.urgency}</span>
      </div>
    </div>`;
}).join('');

// Skill tag cloud — extract from request tags
const tagCount = {};
reqs.forEach(r => (r.tags || []).forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
const sortedTags = Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).slice(0, 10);
document.getElementById('skillTags').innerHTML = sortedTags.length
  ? sortedTags.map(([t]) => `<span class="tag">${t}</span>`).join('')
  : '<span class="muted">No tags yet — post a request to seed the cloud.</span>';
