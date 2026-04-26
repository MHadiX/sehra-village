// ============================================================
// SEHRA VILLAGE — main.js
// All content is loaded from GitHub (raw JSON files committed
// by Netlify CMS). format:json is set in admin/config.yml so
// every CMS save produces a .json file, not .md.
// ============================================================

const REPO_OWNER = 'mhadix';
const REPO_NAME  = 'sehra-village';

// Fetch a file's JSON from GitHub raw CDN (bypasses API rate limits)
async function ghFetch(path) {
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}?t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Not found: ${path}`);
  return res.json();
}

// List files in a GitHub directory via the API, return download URLs
async function ghListDir(path) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Dir not found: ${path}`);
  const files = await res.json();
  return files.filter(f => f.name.endsWith('.json'));
}

// Fetch all JSON files from a directory in parallel
async function ghFetchDir(path) {
  const files = await ghListDir(path);
  return Promise.all(files.map(f => fetch(f.download_url).then(r => r.json())));
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// PAGE TEMPLATES
// ============================================================

function getHomePage() {
  return `
<div class="hero">
  <div class="hero-pattern"></div>
  <div class="hero-content">
    <div class="hero-pill">🌙 Welcome to Our Village</div>
    <h1>Village of<br><span>Sehra</span></h1>
    <p>A warm, peaceful community in Azad Jammu &amp; Kashmir — rich in culture, tradition, and natural beauty.</p>
    <div class="hero-btns">
      <button class="btn btn-white" onclick="navigateTo('about')">Discover Sehra</button>
      <button class="btn btn-outline-white" onclick="navigateTo('contact')">Get In Touch</button>
    </div>
  </div>
  <svg class="hero-wave" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#f7fafc"/></svg>
</div>

<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat-item"><div class="stat-num" id="stat-population">5,000+</div><div class="stat-label">Residents</div></div>
    <div class="stat-item"><div class="stat-num" id="stat-history">100+</div><div class="stat-label">Years History</div></div>
    <div class="stat-item"><div class="stat-num" id="stat-province">AJK</div><div class="stat-label">Province</div></div>
    <div class="stat-item"><div class="stat-num" id="stat-country">Pakistan</div><div class="stat-label">Country</div></div>
  </div>
</div>

<section class="section bg-light">
  <div class="container">
    <div style="margin-bottom:2.5rem">
      <div class="section-tag">Highlights</div>
      <h2 class="section-title">What Makes Sehra <span>Special</span></h2>
      <p class="section-desc">From fertile farmlands to a close-knit community — Sehra offers a life rooted in tradition and warmth.</p>
    </div>
    <div class="cards-grid" id="mainCardsGrid">
      <div class="card"><img class="card-img" src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80" alt="Mosque"/><div class="card-body"><div class="card-icon sky">🕌</div><h3>Historic Mosque</h3><p>The spiritual and social heart of the community.</p></div></div>
      <div class="card"><img class="card-img" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" alt="Fields"/><div class="card-body"><div class="card-icon gold">🌾</div><h3>Golden Farmlands</h3><p>Rich agricultural fields — the backbone of our economy.</p></div></div>
      <div class="card"><img class="card-img" src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" alt="School"/><div class="card-body"><div class="card-icon green">🏫</div><h3>Village School</h3><p>Educating the next generation of Sehra's children.</p></div></div>
    </div>
  </div>
</section>

<section class="section bg-white">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2rem">
      <div><div class="section-tag">Latest</div><h2 class="section-title">Village <span>News</span></h2></div>
      <button class="btn btn-sky" onclick="navigateTo('news')">View All →</button>
    </div>
    <div class="news-list" id="latestNewsList"><p style="color:var(--text-muted);text-align:center;padding:2rem">Loading news...</p></div>
  </div>
</section>

<section class="section bg-sky-light">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
      <div><div class="section-tag">Location</div><h2 class="section-title">Find <span>Sehra</span> on the Map</h2></div>
      <button class="btn btn-sky" onclick="navigateTo('contact')">Get Directions →</button>
    </div>
    <div class="map-wrapper">
      <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=73.2,34.2,73.7,34.5&layer=mapnik&marker=34.37,73.47" title="Sehra Village Location" loading="lazy" allowfullscreen></iframe>
    </div>
    <div class="map-info-grid">
      <div class="map-info-card"><div class="map-info-icon">📍</div><div><h4>Location</h4><p id="map-location">AJK, Pakistan</p></div></div>
      <div class="map-info-card"><div class="map-info-icon">🗺️</div><div><h4>Province</h4><p id="map-province">AJK</p></div></div>
      <div class="map-info-card"><div class="map-info-icon">🚗</div><div><h4>Nearest City</h4><p id="map-city">Muzaffarabad</p></div></div>
    </div>
  </div>
</section>

<section class="section bg-white">
  <div class="container">
    <div class="cta-banner">
      <h2>Be Part of Our Community</h2>
      <p>Whether you're a resident, diaspora member, or a visitor — Sehra welcomes you.</p>
      <button class="btn btn-white" onclick="navigateTo('contact')">Contact Us Today</button>
    </div>
  </div>
</section>`;
}

function getAboutPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,var(--green),var(--sky))">
  <h1>About Sehra Village</h1>
  <p>Discover the rich history, warm culture, and community spirit that define our beloved village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>About</div></div>

<section class="section bg-light">
  <div class="container">
    <div class="about-grid">
      <div>
        <div class="section-tag">Our Story</div>
        <h2 class="section-title">A Village with Deep <span>Roots</span></h2>
        <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1rem">Sehra is a vibrant village in Azad Jammu &amp; Kashmir, Pakistan. For generations, our families have worked the land, built homes, and created a community bonded by faith, tradition, and shared values.</p>
        <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1rem">The name "Sehra" evokes openness and nature — and our village lives up to that name with lush green fields, clear skies, and welcoming people.</p>
        <p style="color:var(--text-muted);line-height:1.8">Today, Sehra continues to grow — embracing modern development while preserving the traditions that have always defined us.</p>
        <div class="about-features">
          <div class="feature-box"><h4>🕌 Faith</h4><p>A deeply religious community centered around our historic mosques.</p></div>
          <div class="feature-box"><h4>🌾 Agriculture</h4><p>Fertile land sustaining families through wheat, rice and vegetables.</p></div>
          <div class="feature-box"><h4>📚 Education</h4><p>Strong emphasis on schooling and building a brighter future.</p></div>
          <div class="feature-box"><h4>🤝 Unity</h4><p>A close-knit community that supports each other through all seasons.</p></div>
        </div>
      </div>
      <div>
        <img class="about-img" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80" alt="Sehra Village"/>
      </div>
    </div>
  </div>
</section>

<section class="section bg-white">
  <div class="container">
    <div style="text-align:center;margin-bottom:2.5rem">
      <div class="section-tag" style="justify-content:center">Community</div>
      <h2 class="section-title">Life in <span>Sehra</span></h2>
    </div>
    <div class="cards-grid">
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🌅</div><h3>Rural Serenity</h3><p>Wake up to birdsong, fresh air, and open fields.</p></div></div>
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🍽️</div><h3>Traditional Cuisine</h3><p>Authentic Kashmiri &amp; Punjabi flavors — fresh roti, hearty daal.</p></div></div>
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🎊</div><h3>Festivals &amp; Events</h3><p>From Eid to harvest festivals, Sehra comes alive with community gatherings.</p></div></div>
    </div>
  </div>
</section>

<section class="section bg-sky-light">
  <div class="container">
    <div class="section-tag">Numbers</div>
    <h2 class="section-title">Sehra at a <span>Glance</span></h2>
    <div class="stats-inner" style="max-width:700px;background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-top:1.5rem;border:1px solid var(--border)">
      <div class="stat-item"><div class="stat-num" id="about-population">5,000+</div><div class="stat-label">Population</div></div>
      <div class="stat-item"><div class="stat-num" id="about-history">100+</div><div class="stat-label">Years Old</div></div>
      <div class="stat-item"><div class="stat-num" id="about-schools">3</div><div class="stat-label">Schools</div></div>
      <div class="stat-item" style="border-right:none"><div class="stat-num" id="about-mosques">1</div><div class="stat-label">Mosques</div></div>
    </div>
  </div>
</section>`;
}

function getNewsPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,#1a2738,var(--sky))">
  <h1>Village News &amp; Events</h1>
  <p>Stay updated with the latest announcements, stories, and events in Sehra Village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>News</div></div>

<section class="section bg-light">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:2rem;align-items:start" class="news-layout">
      <div id="allNewsList"><p style="color:var(--text-muted);text-align:center;padding:2rem">Loading news...</p></div>
      <div style="display:flex;flex-direction:column;gap:1.2rem">
        <div style="background:var(--white);border-radius:var(--radius);padding:1.4rem;box-shadow:var(--shadow)">
          <h4 style="font-size:0.8rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem">📂 Categories</h4>
          <div id="newsCategoriesList">
            <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:700;color:var(--sky);padding:0.4rem 0;border-bottom:1px solid var(--border)">All News <span style="background:var(--sky-light);padding:0.1rem 0.6rem;border-radius:20px" id="newsCount">0</span></div>
          </div>
        </div>
        <div id="noticeSidebar" style="background:var(--sky);border-radius:var(--radius);padding:1.4rem;color:#fff">
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4>
          <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">Loading...</p>
        </div>
        <div id="upcomingSidebar" style="background:var(--gold-light);border-radius:var(--radius);padding:1.4rem;border:1px solid #f0c060">
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 Upcoming</h4>
          <p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">Loading...</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function getGalleryPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,var(--green),#1a9fd4)">
  <h1>Village Gallery</h1>
  <p>A visual journey through the everyday life, landscapes, and beauty of Sehra Village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>Gallery</div></div>
<section class="section bg-light">
  <div class="container">
    <div class="gallery-grid" id="galleryGrid">
      <p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">Loading gallery...</p>
    </div>
  </div>
</section>`;
}

function getContactPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,var(--sky-dark),var(--green))">
  <h1>Contact Us</h1>
  <p>Have a question or suggestion? We'd love to hear from you.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>Contact</div></div>
<section class="section bg-light">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info">
        <div class="contact-card"><div class="contact-card-icon">📍</div><div><h4>Address</h4><p id="contact-location">Sehra Village, AJK, Pakistan</p></div></div>
        <div class="contact-card"><div class="contact-card-icon">📞</div><div><h4>Phone</h4><p id="contact-phone">+92 300 0000000</p></div></div>
        <div class="contact-card"><div class="contact-card-icon">✉️</div><div><h4>Email</h4><p id="contact-email">contact@sehravillage.site</p></div></div>
        <div class="contact-card"><div class="contact-card-icon">🕐</div><div><h4>Office Hours</h4><p>Mon – Sat: 9:00 AM – 5:00 PM</p></div></div>
        <div class="map-wrapper">
          <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=73.2,34.2,73.7,34.5&layer=mapnik&marker=34.37,73.47" title="Sehra Village Map" loading="lazy" allowfullscreen></iframe>
        </div>
      </div>
      <div class="contact-form-box">
        <h3>Send a Message</h3>
        <p>Fill in the form and we'll get back to you shortly.</p>
        <div id="contactSuccess" style="display:none;background:#e6f9f0;border:1px solid #34c67a;border-radius:8px;padding:1rem;margin-bottom:1rem;color:#1a7a4a;font-weight:600">
          ✅ Message sent! We'll be in touch soon.
        </div>
        <form id="contactForm" onsubmit="handleContactSubmit(event)" name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact"/>
          <div class="form-row">
            <div class="form-group"><label>First Name*</label><input type="text" name="firstName" required placeholder="Ahmad"/></div>
            <div class="form-group"><label>Last Name*</label><input type="text" name="lastName" required placeholder="Ali"/></div>
          </div>
          <div class="form-group"><label>Email Address*</label><input type="email" name="email" required placeholder="your@email.com"/></div>
          <div class="form-group">
            <label>Subject*</label>
            <select name="subject" required>
              <option>General Inquiry</option>
              <option>Report a Problem</option>
              <option>Submit Village News</option>
              <option>Development Suggestion</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group"><label>Message*</label><textarea rows="5" name="message" required placeholder="Write your message here..."></textarea></div>
          <button type="submit" id="contactSubmitBtn" class="btn btn-sky" style="width:100%;padding:0.9rem">Send Message ✉</button>
        </form>
      </div>
    </div>
  </div>
</section>`;
}

// ============================================================
// PAGE INIT FUNCTIONS
// ============================================================

async function initHomePage() {
  // Load site settings
  try {
    const s = await ghFetch('settings/site.json');
    setText('stat-population', s.population);
    setText('stat-history',    s.yearsHistory);
    setText('stat-province',   s.province);
    setText('stat-country',    s.country);
    setText('map-location',    s.location);
    setText('map-province',    s.province);
    setText('map-city',        s.nearestCity);
    // also update topbar/footer via config.js vars
    Object.assign(siteConfig, s);
    updateSiteSettings();
  } catch(e) { console.log('Home: using default settings'); }

  // Load news
  try {
    const items = await ghFetchDir('content/news');
    items.sort((a,b) => new Date(b.date) - new Date(a.date));
    const el = document.getElementById('latestNewsList');
    if (el) el.innerHTML = items.length
      ? items.slice(0,3).map(i => createNewsCard(i, false)).join('')
      : '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. Add via admin panel.</p>';
  } catch(e) {
    const el = document.getElementById('latestNewsList');
    if (el) el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet.</p>';
  }

  // Load main cards
  try {
    const cards = await ghFetchDir('content/main-cards');
    cards.sort((a,b) => (a.order||999)-(b.order||999));
    const grid = document.getElementById('mainCardsGrid');
    if (grid && cards.length) {
      grid.innerHTML = cards.map(c => `
        <div class="card">
          <img class="card-img" src="${c.image}" alt="${c.title}" onerror="this.src='https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80'"/>
          <div class="card-body">
            <div class="card-icon ${c.iconColor||'sky'}">${c.icon||'🏡'}</div>
            <h3>${c.title}</h3>
            <p>${c.description}</p>
            ${c.meta ? `<div class="card-meta">${c.meta}</div>` : ''}
          </div>
        </div>`).join('');
    }
  } catch(e) { console.log('Home: using default cards'); }
}

async function initAboutPage() {
  try {
    const s = await ghFetch('settings/site.json');
    setText('about-population', s.population);
    setText('about-history',    s.yearsHistory);
    setText('about-schools',    s.schools);
    setText('about-mosques',    s.mosques);
  } catch(e) { console.log('About: using default settings'); }
}

async function initNewsPage() {
  // News list
  const listEl = document.getElementById('allNewsList');
  const countEl = document.getElementById('newsCount');
  try {
    const items = await ghFetchDir('content/news');
    items.sort((a,b) => new Date(b.date) - new Date(a.date));
    if (countEl) countEl.textContent = items.length;
    if (listEl) listEl.innerHTML = items.length
      ? `<div style="display:flex;flex-direction:column;gap:1.5rem">${items.map(i => createNewsCard(i, true)).join('')}</div>`
      : '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. Add via admin panel.</p>';
  } catch(e) {
    if (listEl) listEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet.</p>';
  }

  // Notice sidebar
  const noticeEl = document.getElementById('noticeSidebar');
  try {
    const notice = await ghFetch('content/notice.json');
    if (noticeEl) noticeEl.innerHTML = notice.enabled
      ? `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 ${notice.title||'Notice'}</h4><p style="font-size:0.88rem;line-height:1.6;opacity:0.9">${notice.content}</p>`
      : `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4><p style="font-size:0.88rem;line-height:1.6;opacity:0.9">No notice at this time.</p>`;
  } catch(e) {
    if (noticeEl) noticeEl.innerHTML = `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4><p style="font-size:0.88rem;line-height:1.6;opacity:0.9">No notice at this time.</p>`;
  }

  // Upcoming sidebar
  const upcomingEl = document.getElementById('upcomingSidebar');
  try {
    const upcoming = await ghFetch('content/upcoming.json');
    if (upcomingEl) upcomingEl.innerHTML = upcoming.enabled
      ? `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 ${upcoming.title||'Upcoming'}</h4><p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">${upcoming.content}</p>`
      : `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 Upcoming</h4><p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">No upcoming events.</p>`;
  } catch(e) {
    if (upcomingEl) upcomingEl.innerHTML = `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 Upcoming</h4><p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">No upcoming events.</p>`;
  }
}

async function initGalleryPage() {
  const grid = document.getElementById('galleryGrid');
  try {
    const items = await ghFetchDir('content/gallery');
    items.sort((a,b) => (a.order||999)-(b.order||999));
    if (grid) grid.innerHTML = items.length
      ? items.map(item => `
          <div class="g-item">
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'"/>
            <div class="g-item-caption">
              <h4>${item.title}</h4>
              <p>${item.description||''}</p>
            </div>
          </div>`).join('')
      : '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add via admin panel.</p>';
  } catch(e) {
    if (grid) grid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add via admin panel.</p>';
  }
}

async function initContactPage() {
  try {
    const s = await ghFetch('settings/site.json');
    setText('contact-location', s.location);
    setText('contact-phone',    s.phone);
    setText('contact-email',    s.email);
  } catch(e) { /* use defaults already in HTML */ }
}

// ============================================================
// HELPERS
// ============================================================

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val) el.textContent = val;
}

function createNewsCard(item, detailed = false) {
  const date = new Date(item.date);
  const day   = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();

  if (detailed) {
    return `
      <div class="card" style="overflow:hidden">
        ${item.image ? `<img class="card-img" src="${item.image}" alt="${item.title}" style="height:220px" onerror="this.style.display='none'"/>` : ''}
        <div class="card-body">
          <span class="news-tag">${item.category||'News'}</span>
          <h3 style="font-size:1.15rem;margin:0.5rem 0">${item.title}</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7">${item.content}</p>
          <div style="display:flex;gap:1rem;margin-top:1rem;font-size:0.8rem;color:var(--text-muted);font-weight:700">
            <span>📅 ${date.toLocaleDateString()}</span>
            ${item.author ? `<span>👤 ${item.author}</span>` : ''}
          </div>
        </div>
      </div>`;
  }
  return `
    <div class="news-item">
      <div class="news-date-badge"><div class="day">${day}</div><div class="month">${month}</div></div>
      <div class="news-content">
        <span class="news-tag">${item.category||'News'}</span>
        <h3>${item.title}</h3>
        <p>${(item.content||'').substring(0,150)}${(item.content||'').length>150?'...':''}</p>
      </div>
    </div>`;
}

// ============================================================
// CONTACT FORM — uses Netlify Forms (no backend required)
// ============================================================

async function handleContactSubmit(event) {
  event.preventDefault();
  const form   = event.target;
  const btn    = document.getElementById('contactSubmitBtn');
  const successDiv = document.getElementById('contactSuccess');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const formData = new FormData(form);

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      if (successDiv) successDiv.style.display = 'block';
      form.reset();
      showToast('✅ Message sent! We\'ll be in touch soon.', 'success');
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    showToast('❌ Failed to send. Please email us directly.', 'error');
  } finally {
    btn.textContent = 'Send Message ✉';
    btn.disabled = false;
  }
}
