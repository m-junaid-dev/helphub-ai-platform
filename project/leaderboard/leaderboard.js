HH.injectNav('leaderboard', '../');
HH.injectFooter();

const helpers = HH.Store.getHelpers().slice().sort((a, b) => b.trust - a.trust);

document.getElementById('rankList').innerHTML = helpers.map((h, i) => `
  <div class="rank-row">
    <div class="avatar av-${(i % 5) + 1}">${h.initials}</div>
    <div class="rank-meta">
      <strong>#${i + 1} ${h.name}</strong>
      <span>${h.skills.join(', ')}</span>
    </div>
    <div class="rank-score">
      <div class="pct">${h.trust}%</div>
      <div class="ct">${h.contributions} contributions</div>
    </div>
  </div>
`).join('');

document.getElementById('badgeList').innerHTML = helpers.map(h => `
  <div class="badge-row">
    <strong>${h.name}</strong>
    <div class="badges">${h.badges.join(' · ')}</div>
    <div class="bar"><span style="width:${h.trust}%"></span></div>
  </div>
`).join('');
