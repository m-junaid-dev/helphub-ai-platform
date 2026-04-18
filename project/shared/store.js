/* ===== HelpHub AI — Shared store, AI helpers, navbar/footer injectors ===== */
(function (global) {
  const KEY = 'helphub.state.v1';

  const seedRequests = [
    {
      id: 'r1',
      title: 'Need help making my portfolio responsive before demo day',
      description: 'My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.',
      category: 'Web Development',
      urgency: 'High',
      status: 'Solved',
      tags: ['HTML/CSS', 'Responsive', 'Portfolio'],
      author: 'Sara Noor',
      location: 'Karachi',
      helpers: 1
    },
    {
      id: 'r2',
      title: 'Looking for Figma feedback on a volunteer event poster',
      description: 'I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.',
      category: 'Design',
      urgency: 'Medium',
      status: 'Open',
      tags: ['Figma', 'Poster', 'Design Review'],
      author: 'Ayesha Khan',
      location: 'Lahore',
      helpers: 1
    },
    {
      id: 'r3',
      title: 'Need mock interview support for internship applications',
      description: 'Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.',
      category: 'Career',
      urgency: 'Low',
      status: 'Solved',
      tags: ['Interview Prep', 'Career', 'Frontend'],
      author: 'Sara Noor',
      location: 'Remote',
      helpers: 2
    },
    {
      id: 'r4',
      title: 'Stuck debugging a React useEffect loop',
      description: 'Component re-renders forever — I think a dependency is wrong but I can\'t spot it. Urgent before submission.',
      category: 'Web Development',
      urgency: 'High',
      status: 'Open',
      tags: ['React', 'Debugging', 'JavaScript'],
      author: 'Hassan Ali',
      location: 'Islamabad',
      helpers: 0
    },
    {
      id: 'r5',
      title: 'Want a Python data analysis review',
      description: 'Built a small pandas notebook for a class project and would love a sanity check on the methodology.',
      category: 'Data',
      urgency: 'Low',
      status: 'Open',
      tags: ['Python', 'Pandas', 'Data Analysis'],
      author: 'Sara Noor',
      location: 'Karachi',
      helpers: 0
    }
  ];

  const seedHelpers = [
    { id: 'u1', name: 'Ayesha Khan',  initials: 'AK', skills: ['Figma', 'UI/UX', 'HTML/CSS'],          trust: 100, contributions: 35, badges: ['Design Ally', 'Fast Responder', 'Top Mentor'] },
    { id: 'u2', name: 'Hassan Ali',   initials: 'HA', skills: ['JavaScript', 'React', 'Git/GitHub'],   trust: 88,  contributions: 24, badges: ['Code Rescuer', 'Bug Hunter'] },
    { id: 'u3', name: 'Sara Noor',    initials: 'SN', skills: ['Python', 'Data Analysis'],             trust: 74,  contributions: 11, badges: ['Community Voice'] },
    { id: 'u4', name: 'Bilal Raza',   initials: 'BR', skills: ['Career Coaching', 'Interview Prep'],   trust: 69,  contributions: 9,  badges: ['Mentor'] },
    { id: 'u5', name: 'Mariam Tariq', initials: 'MT', skills: ['Figma', 'Brand Design'],               trust: 62,  contributions: 7,  badges: ['Design Ally'] }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const initial = { requests: seedRequests, helpers: seedHelpers };
    localStorage.setItem(KEY, JSON.stringify(initial));
    return initial;
  }
  function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }

  const Store = {
    getRequests() { return load().requests; },
    getHelpers()  { return load().helpers; },
    addRequest(req) {
      const state = load();
      state.requests.unshift({ id: 'r' + Date.now(), helpers: 0, status: 'Open', ...req });
      save(state);
    },
    reset() { localStorage.removeItem(KEY); }
  };

  /* ===== AI-like helpers ===== */
  const CATEGORY_KEYWORDS = {
    'Web Development': ['html', 'css', 'react', 'javascript', 'js', 'website', 'frontend', 'backend', 'node', 'api', 'responsive', 'portfolio'],
    'Design':          ['figma', 'design', 'poster', 'ux', 'ui', 'brand', 'logo', 'typography'],
    'Career':          ['interview', 'resume', 'cv', 'internship', 'job', 'career', 'mock'],
    'Data':            ['python', 'pandas', 'data', 'analysis', 'ml', 'machine learning', 'sql'],
    'Community':       ['event', 'volunteer', 'community', 'campus']
  };
  const URGENCY_HIGH = ['urgent', 'asap', 'tomorrow', 'tonight', 'deadline', 'today', 'immediately'];
  const URGENCY_LOW  = ['someday', 'eventually', 'no rush', 'whenever'];

  const Ai = {
    detectCategory(text) {
      const t = (text || '').toLowerCase();
      let best = { cat: 'Community', score: 0 };
      for (const cat of Object.keys(CATEGORY_KEYWORDS)) {
        const score = CATEGORY_KEYWORDS[cat].reduce((s, k) => s + (t.includes(k) ? 1 : 0), 0);
        if (score > best.score) best = { cat, score };
      }
      return best.cat;
    },
    detectUrgency(text) {
      const t = (text || '').toLowerCase();
      if (URGENCY_HIGH.some(k => t.includes(k))) return 'High';
      if (URGENCY_LOW.some(k => t.includes(k)))  return 'Low';
      return 'Medium';
    },
    suggestTags(text) {
      const t = (text || '').toLowerCase();
      const pool = ['React', 'JavaScript', 'HTML/CSS', 'Responsive', 'Figma', 'UI/UX', 'Python', 'Pandas', 'Career', 'Interview Prep', 'Portfolio', 'Debugging'];
      return pool.filter(tag => t.includes(tag.toLowerCase().split('/')[0])).slice(0, 4);
    },
    summarize(text, words = 18) {
      const w = (text || '').trim().split(/\s+/);
      if (w.length <= words) return text;
      return w.slice(0, words).join(' ') + '…';
    },
    rewrite(text) {
      const s = Ai.summarize(text, 22);
      if (!s) return 'Start describing the challenge to generate a stronger version.';
      return 'Help needed: ' + s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  /* ===== Navbar / Footer injectors ===== */
  function injectNav(active, base) {
    base = base || '../';
    const html = `
      <header class="navbar">
        <div class="nav-inner">
          <a class="brand" href="${base}home/index.html">
            <span class="brand-mark">H</span>
            <span>HelpHub AI</span>
          </a>
          <ul class="nav-links">
            <li><a href="${base}home/index.html"        class="${active==='home'?'active':''}">Home</a></li>
            <li><a href="${base}explore/explore.html"   class="${active==='explore'?'active':''}">Explore</a></li>
            <li><a href="${base}leaderboard/leaderboard.html" class="${active==='leaderboard'?'active':''}">Leaderboard</a></li>
            <li><a href="${base}ai-center/ai.html"      class="${active==='ai'?'active':''}">AI Center</a></li>
          </ul>
          <div class="nav-cta">
            <button class="btn btn-ghost">Live community signals</button>
            <a class="btn btn-primary" href="${base}explore/explore.html">Join the platform</a>
          </div>
        </div>
      </header>`;
    document.body.insertAdjacentHTML('afterbegin', html);
  }

  function injectFooter() {
    const html = `
      <footer class="site-footer">
        <div class="container">
          HelpHub AI · A community-powered support network · Built with HTML, CSS, and JavaScript.
        </div>
      </footer>`;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  global.HH = { Store, Ai, injectNav, injectFooter };
})(window);
