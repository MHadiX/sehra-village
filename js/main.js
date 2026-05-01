// ============================================================
// SEHRA VILLAGE — main.js
// Content is served as static files from Netlify.
// build.sh generates index.json files for each content folder.
// JS fetches /content/news/index.json → gets filenames →
// fetches each file from /content/news/filename.json
// NO GitHub API. NO external dependencies. Always works.
// ============================================================

// Fetch JSON from a local path with cache-busting
async function localFetch(path) {
  const res = await fetch(`/${path}?v=${Date.now()}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

// Fetch all items in a content folder using its index.json
async function fetchFolder(folder) {
  const filenames = await localFetch(`content/${folder}/index.json`);
  if (!filenames || filenames.length === 0) return [];
  const results = await Promise.all(
    filenames.map(name =>
      localFetch(`content/${folder}/${name}`).catch(() => null)
    )
  );
  return results.filter(Boolean);
}

// Toast
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// Set text of element by ID
function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null) el.textContent = val;
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
    </div>
    <div class="cards-grid" id="mainCardsGrid">
      <div style="text-align:center;padding:2rem;color:var(--text-muted);grid-column:1/-1">Loading...</div>
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
    <div style="margin-bottom:1.5rem"><div class="section-tag">Location</div><h2 class="section-title">Find <span>Sehra</span> on the Map</h2></div>
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
      <p>Whether you're a resident, diaspora member, or visitor — Sehra welcomes you.</p>
      <button class="btn btn-white" onclick="navigateTo('contact')">Contact Us Today</button>
    </div>
  </div>
</section>`;
}

function getAboutPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,var(--green),var(--sky))">
  <h1>About Sehra Village</h1>
  <p>Discover the rich history, warm culture, and community spirit that define our village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>About</div></div>
<section class="section bg-light">
  <div class="container">
    <div class="about-grid">
      <div>
        <div class="section-tag">Our Story</div>
        <h2 class="section-title">A Village with Deep <span>Roots</span></h2>
        <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1rem">Sehra is a vibrant village in Azad Jammu &amp; Kashmir, Pakistan. For generations, our families have worked the land, built homes, and created a community bonded by faith, tradition, and shared values.</p>
        <p style="color:var(--text-muted);line-height:1.8">Today, Sehra continues to grow — embracing modern development while preserving the traditions that define us.</p>
        <div class="about-features">
          <div class="feature-box"><h4>🕌 Faith</h4><p>A deeply religious community centered around our historic mosques.</p></div>
          <div class="feature-box"><h4>🌾 Agriculture</h4><p>Fertile land sustaining families for generations.</p></div>
          <div class="feature-box"><h4>📚 Education</h4><p>Strong emphasis on schooling and building a brighter future.</p></div>
          <div class="feature-box"><h4>🤝 Unity</h4><p>A close-knit community that supports each other.</p></div>
        </div>
      </div>
      <div>
        <img class="about-img" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80" alt="Sehra Village"/>
      </div>
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
  <p>Stay updated with the latest announcements and stories from Sehra Village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>News</div></div>
<section class="section bg-light">
  <div class="container">
    <div class="news-layout">
      <div id="allNewsList"><p style="color:var(--text-muted);text-align:center;padding:2rem">Loading news...</p></div>
      <div style="display:flex;flex-direction:column;gap:1.2rem">
        <div id="noticeSidebar" style="background:var(--sky);border-radius:var(--radius);padding:1.4rem;color:#fff">
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4>
          <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">Loading...</p>
        </div>
        <div id="upcomingSidebar" style="background:var(--gold-light,#fffbea);border-radius:var(--radius);padding:1.4rem;border:1px solid #f0c060">
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold,#d4a017);margin-bottom:0.6rem">🎉 Upcoming</h4>
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
  <p>A visual journey through everyday life, landscapes, and beauty of Sehra Village.</p>
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
<div class="page-hero" style="background:linear-gradient(135deg,var(--sky-dark,#0a5c8a),var(--green))">
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
          <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=73.2,34.2,73.7,34.5&layer=mapnik&marker=34.37,73.47" title="Sehra Map" loading="lazy" allowfullscreen></iframe>
        </div>
      </div>
      <div class="contact-form-box">
        <h3>Send a Message</h3>
        <p style="color:var(--text-muted);margin-bottom:1.5rem">Fill in the form and we'll get back to you shortly.</p>
        <div id="contactSuccess" style="display:none;background:#e6f9f0;border:1px solid #34c67a;border-radius:8px;padding:1rem;margin-bottom:1rem;color:#1a7a4a;font-weight:600">
          ✅ Message sent successfully! We'll be in touch soon.
        </div>
        <form id="contactForm" onsubmit="handleContactSubmit(event)">
          <div class="form-row">
            <div class="form-group"><label>First Name *</label><input type="text" name="firstName" required placeholder="Ahmad"/></div>
            <div class="form-group"><label>Last Name *</label><input type="text" name="lastName" required placeholder="Ali"/></div>
          </div>
          <div class="form-group"><label>Email Address *</label><input type="email" name="email" required placeholder="your@email.com"/></div>
          <div class="form-group">
            <label>Subject *</label>
            <select name="subject" required>
              <option value="">Select a subject...</option>
              <option>General Inquiry</option>
              <option>Report a Problem</option>
              <option>Submit Village News</option>
              <option>Development Suggestion</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group"><label>Message *</label><textarea rows="5" name="message" required placeholder="Write your message here..."></textarea></div>
          <button type="submit" id="contactSubmitBtn" class="btn btn-sky" style="width:100%;padding:0.9rem;font-size:1rem">Send Message ✉</button>
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
  // Load settings
  try {
    const s = await localFetch('settings/site.json');
    setText('stat-population', s.population);
    setText('stat-history', s.yearsHistory);
    setText('stat-province', s.province);
    setText('stat-country', s.country);
    setText('map-location', s.location);
    setText('map-province', s.province);
    setText('map-city', s.nearestCity);
    setText('topbar-location', s.location);
    setText('topbar-phone', s.phone);
    setText('topbar-email', s.email);
    setText('footer-phone', s.phone);
    setText('footer-email', s.email);
  } catch(e) { console.warn('Settings load failed, using defaults'); }

  // Load main cards
  try {
    const cards = await fetchFolder('main-cards');
    cards.sort((a, b) => (a.order || 999) - (b.order || 999));
    const grid = document.getElementById('mainCardsGrid');
    if (grid && cards.length > 0) {
      grid.innerHTML = cards.map(c => `
        <div class="card">
          <img class="card-img" src="${c.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'}" alt="${c.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'"/>
          <div class="card-body">
            <div class="card-icon ${c.iconColor || 'sky'}">${c.icon || '🏡'}</div>
            <h3>${c.title}</h3>
            <p>${c.description || ''}</p>
            ${c.meta ? `<div class="card-meta">${c.meta}</div>` : ''}
          </div>
        </div>`).join('');
    }
  } catch(e) { console.warn('Cards load failed'); }

  // Load latest news
  try {
    const items = await fetchFolder('news');
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    const el = document.getElementById('latestNewsList');
    if (el) {
      el.innerHTML = items.length > 0
        ? items.slice(0, 3).map(i => newsCardHTML(i, false)).join('')
        : '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. Add via the admin panel.</p>';
    }
  } catch(e) {
    const el = document.getElementById('latestNewsList');
    if (el) el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet.</p>';
  }
}

async function initAboutPage() {
  try {
    const s = await localFetch('settings/site.json');
    setText('about-population', s.population);
    setText('about-history', s.yearsHistory);
    setText('about-schools', s.schools);
    setText('about-mosques', s.mosques);
  } catch(e) { console.warn('About settings load failed, using defaults'); }
}

async function initNewsPage() {
  // Load all news
  const listEl = document.getElementById('allNewsList');
  try {
    const items = await fetchFolder('news');
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (listEl) {
      listEl.innerHTML = items.length > 0
        ? `<div style="display:flex;flex-direction:column;gap:1.5rem">${items.map(i => newsCardHTML(i, true)).join('')}</div>`
        : '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. Add via the admin panel.</p>';
    }
  } catch(e) {
    if (listEl) listEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. Add articles via the admin panel.</p>';
  }

  // Load notice
  const noticeEl = document.getElementById('noticeSidebar');
  try {
    const n = await localFetch('content/notice.json');
    if (noticeEl) {
      if (n.enabled) {
        noticeEl.innerHTML = `
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 ${n.title || 'Notice'}</h4>
          <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">${n.content}</p>`;
      } else {
        noticeEl.style.display = 'none';
      }
    }
  } catch(e) {
    if (noticeEl) noticeEl.innerHTML = `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4><p style="font-size:0.88rem;opacity:0.9">No notices at this time.</p>`;
  }

  // Load upcoming
  const upcomingEl = document.getElementById('upcomingSidebar');
  try {
    const u = await localFetch('content/upcoming.json');
    if (upcomingEl) {
      if (u.enabled) {
        upcomingEl.innerHTML = `
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold,#d4a017);margin-bottom:0.6rem">🎉 ${u.title || 'Upcoming'}</h4>
          <p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">${u.content}</p>`;
      } else {
        upcomingEl.style.display = 'none';
      }
    }
  } catch(e) {
    if (upcomingEl) upcomingEl.innerHTML = `<h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold,#d4a017);margin-bottom:0.6rem">🎉 Upcoming</h4><p style="font-size:0.88rem;color:var(--text-muted)">No upcoming events.</p>`;
  }
}

async function initGalleryPage() {
  const grid = document.getElementById('galleryGrid');
  try {
    const items = await fetchFolder('gallery');
    items.sort((a, b) => (a.order || 999) - (b.order || 999));
    if (grid) {
      grid.innerHTML = items.length > 0
        ? items.map(item => `
            <div class="g-item">
              <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'"/>
              <div class="g-item-caption">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
              </div>
            </div>`).join('')
        : '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add via the admin panel.</p>';
    }
  } catch(e) {
    if (grid) grid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add via the admin panel.</p>';
    console.warn('Gallery load failed:', e);
  }
}

async function initContactPage() {
  try {
    const s = await localFetch('settings/site.json');
    setText('contact-location', s.location);
    setText('contact-phone', s.phone);
    setText('contact-email', s.email);
  } catch(e) { /* defaults are in HTML */ }
}

// ============================================================
// NEWS CARD HTML
// ============================================================
function newsCardHTML(item, detailed) {
  const date = new Date(item.date);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
  if (detailed) {
    return `
      <div class="card" style="overflow:hidden">
        ${item.image ? `<img class="card-img" src="${item.image}" alt="${item.title}" style="height:200px;object-fit:cover" onerror="this.style.display='none'"/>` : ''}
        <div class="card-body">
          <span class="news-tag">${item.category || 'News'}</span>
          <h3 style="margin:0.5rem 0;font-size:1.1rem">${item.title}</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7">${item.content || ''}</p>
          <div style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted);font-weight:700;display:flex;gap:1rem">
            <span>📅 ${date.toLocaleDateString('en-GB')}</span>
            ${item.author ? `<span>👤 ${item.author}</span>` : ''}
          </div>
        </div>
      </div>`;
  }
  return `
    <div class="news-item">
      <div class="news-date-badge"><div class="day">${day}</div><div class="month">${month}</div></div>
      <div class="news-content">
        <span class="news-tag">${item.category || 'News'}</span>
        <h3>${item.title}</h3>
        <p>${(item.content || '').substring(0, 150)}${(item.content || '').length > 150 ? '…' : ''}</p>
      </div>
    </div>`;
}

// ============================================================
// CONTACT FORM — Netlify Forms (zero backend, always works)
// ============================================================
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const btn = document.getElementById('contactSubmitBtn');
  const successDiv = document.getElementById('contactSuccess');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const body = new URLSearchParams({
      'form-name': 'contact',
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    }).toString();

    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    if (res.ok) {
      if (successDiv) successDiv.style.display = 'block';
      form.reset();
      showToast('✅ Message sent! We\'ll be in touch soon.', 'success');
    } else {
      throw new Error(`Status ${res.status}`);
    }
  } catch(err) {
    console.error('Contact form error:', err);
    showToast('❌ Could not send. Please email us directly at contact@sehravillage.site', 'error');
  } finally {
    btn.textContent = 'Send Message ✉';
    btn.disabled = false;
  }
}
