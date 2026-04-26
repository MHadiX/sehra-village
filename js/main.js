// Main application logic and page templates

// Base path (Netlify serves from root)
function getBasePath() {
  return '';
}

// Content cache
let contentCache = null;
let lastFetch = 0;
const CACHE_DURATION = 10000; // 10 seconds

// Load ALL content from index file
async function loadContentIndex(forceRefresh = false) {
  const now = Date.now();
  
  // Return cached content if still fresh
  if (!forceRefresh && contentCache && (now - lastFetch < CACHE_DURATION)) {
    console.log('Using cached content');
    return contentCache;
  }
  
  const basePath = getBasePath();
  
  try {
    const response = await fetch(`${basePath}/content-index.json?t=${now}`);
    
    if (response.ok) {
      contentCache = await response.json();
      lastFetch = now;
      console.log('✅ Content index loaded:', contentCache);
      return contentCache;
    }
  } catch (error) {
    console.log('⚠️ Content index not found, using defaults');
  }
  
  // Return default empty structure
  return {
    settings: null,
    news: [],
    gallery: [],
    mainCards: [],
    notice: null,
    upcoming: null
  };
}

// Force reload content (call this after CMS updates)
async function reloadContent() {
  console.log('🔄 Reloading content...');
  contentCache = null;
  const content = await loadContentIndex(true);
  
  // Reload current page
  const currentPage = window.location.hash.slice(1) || 'home';
  loadPage(currentPage);
  
  showToast('✅ Content updated!', 'success');
}

// Auto-reload every 30 seconds to check for updates
setInterval(async () => {
  const content = await loadContentIndex(true);
  console.log('Auto-refresh check completed');
}, 30000);

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
}

// HOME PAGE
function getHomePage() {
  return `
<div class="hero">
  <div class="hero-pattern"></div>
  <div class="hero-content">
    <div class="hero-pill">🌙 Welcome to Our Village</div>
    <h1>Village of<br><span>Sehra</span></h1>
    <p>A warm, peaceful community in Azad Jammu & Kashmir — rich in culture, tradition, and natural beauty.</p>
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
      <div class="card">
        <img class="card-img" src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80" alt="Mosque"/>
        <div class="card-body">
          <div class="card-icon sky">🕌</div>
          <h3>Historic Mosque</h3>
          <p>The spiritual and social heart of the community — serving generations of Sehra families.</p>
          <div class="card-meta">📍 Village Center</div>
        </div>
      </div>
      <div class="card">
        <img class="card-img" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" alt="Fields"/>
        <div class="card-body">
          <div class="card-icon gold">🌾</div>
          <h3>Golden Farmlands</h3>
          <p>Rich agricultural fields of wheat, rice and vegetables — the backbone of our economy.</p>
          <div class="card-meta">🌱 Agriculture</div>
        </div>
      </div>
      <div class="card">
        <img class="card-img" src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" alt="School"/>
        <div class="card-body">
          <div class="card-icon green">🏫</div>
          <h3>Village School</h3>
          <p>Educating the next generation — building bright futures for Sehra's children.</p>
          <div class="card-meta">📚 Education</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section bg-white">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2rem">
      <div>
        <div class="section-tag">Latest</div>
        <h2 class="section-title">Village <span>News</span></h2>
      </div>
      <button class="btn btn-sky" onclick="navigateTo('news')">View All →</button>
    </div>
    <div class="news-list" id="latestNewsList">
      <p style="color:var(--text-muted);text-align:center;padding:2rem">Loading news...</p>
    </div>
  </div>
</section>

<section class="section bg-sky-light">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
      <div>
        <div class="section-tag">Location</div>
        <h2 class="section-title">Find <span>Sehra</span> on the Map</h2>
      </div>
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

// ABOUT PAGE
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
        <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1rem">Sehra is a vibrant village in Azad Jammu & Kashmir, Pakistan. For generations, our families have worked the land, built homes, and created a community bonded by faith, tradition, and shared values.</p>
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
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🌅</div><h3>Rural Serenity</h3><p>Wake up to birdsong, fresh air, and open fields. Life in Sehra moves at a gentle, meaningful pace.</p></div></div>
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🍽️</div><h3>Traditional Cuisine</h3><p>Authentic Kashmiri & Punjabi flavors — fresh roti, hearty daal, and seasonal vegetables grown locally.</p></div></div>
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🎊</div><h3>Festivals & Events</h3><p>From Eid to harvest festivals, Sehra comes alive with music, food, and community gatherings.</p></div></div>
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

// NEWS PAGE
function getNewsPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,#1a2738,var(--sky))">
  <h1>Village News & Events</h1>
  <p>Stay updated with the latest announcements, stories, and events in Sehra Village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>News</div></div>

<section class="section bg-light">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:2rem;align-items:start" class="news-layout">
      <div id="allNewsList">
        <p style="color:var(--text-muted);text-align:center;padding:2rem">Loading news...</p>
      </div>
      
      <div style="display:flex;flex-direction:column;gap:1.2rem">
        <div style="background:var(--white);border-radius:var(--radius);padding:1.4rem;box-shadow:var(--shadow)">
          <h4 style="font-size:0.8rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem">📂 Categories</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem" id="newsCategoriesList">
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

// GALLERY PAGE
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

// CONTACT PAGE  
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
        <form id="contactForm" onsubmit="handleContactSubmit(event)">
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
          <button type="submit" class="btn btn-sky" style="width:100%;padding:0.9rem">Send Message ✉</button>
        </form>
      </div>
    </div>
  </div>
</section>`;
}

// Initialize functions for each page
async function initHomePage() {
  console.log('🏠 Initializing home page...');
  
  const content = await loadContentIndex();
  const basePath = getBasePath();
  
  // Update stats
  if (content.settings) {
    const s = content.settings;
    const els = {
      'stat-population': s.population,
      'stat-history': s.yearsHistory,
      'stat-province': s.province,
      'stat-country': s.country,
      'map-location': s.location,
      'map-province': s.province,
      'map-city': s.nearestCity
    };
    
    Object.entries(els).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '';
    });
  }
  
  // Display news
  const newsList = document.getElementById('latestNewsList');
  if (newsList && content.news.length > 0) {
    newsList.innerHTML = content.news.slice(0, 3).map(item => createNewsCard(item)).join('');
  } else if (newsList) {
    newsList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. <a href="#" onclick="navigateTo(\'news\');return false" style="color:var(--sky)">Add news via admin panel →</a></p>';
  }
  
  // Display main cards
  const cardsGrid = document.getElementById('mainCardsGrid');
  if (cardsGrid && content.mainCards.length > 0) {
    cardsGrid.innerHTML = content.mainCards.map(card => `
      <div class="card">
        <img class="card-img" src="${basePath}${card.image}" alt="${card.title}" onerror="this.src='https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80'"/>
        <div class="card-body">
          <div class="card-icon ${card.iconColor || 'sky'}">${card.icon || '🏡'}</div>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
          ${card.meta ? `<div class="card-meta">${card.meta}</div>` : ''}
        </div>
      </div>
    `).join('');
  }
}

async function initNewsPage() {
  console.log('📰 Initializing news page...');
  
  const content = await loadContentIndex();
  
  // Display all news
  const newsList = document.getElementById('allNewsList');
  const newsCount = document.getElementById('newsCount');
  
  if (newsCount) newsCount.textContent = content.news.length;
  
  if (newsList && content.news.length > 0) {
    newsList.innerHTML = `<div style="display:flex;flex-direction:column;gap:1.5rem">${content.news.map(item => createNewsCard(item, true)).join('')}</div>`;
  } else if (newsList) {
    newsList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news yet. Add news via the admin panel.</p>';
  }
  
  // Display notice
  const noticeSidebar = document.getElementById('noticeSidebar');
  if (noticeSidebar && content.notice && content.notice.enabled) {
    noticeSidebar.innerHTML = `
      <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 ${content.notice.title || 'Notice'}</h4>
      <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">${content.notice.content}</p>
    `;
  } else if (noticeSidebar) {
    noticeSidebar.innerHTML = `
      <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4>
      <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">No notice at this time.</p>
    `;
  }
  
  // Display upcoming
  const upcomingSidebar = document.getElementById('upcomingSidebar');
  if (upcomingSidebar && content.upcoming && content.upcoming.enabled) {
    upcomingSidebar.innerHTML = `
      <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 ${content.upcoming.title || 'Upcoming'}</h4>
      <p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">${content.upcoming.content}</p>
    `;
  } else if (upcomingSidebar) {
    upcomingSidebar.innerHTML = `
      <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 Upcoming</h4>
      <p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">No upcoming events.</p>
    `;
  }
}

async function initGalleryPage() {
  console.log('🖼️ Initializing gallery page...');
  
  const content = await loadContentIndex();
  const basePath = getBasePath();
  const galleryGrid = document.getElementById('galleryGrid');
  
  if (galleryGrid && content.gallery.length > 0) {
    galleryGrid.innerHTML = content.gallery.map(item => `
      <div class="g-item">
        <img src="${basePath}${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'"/>
        <div class="g-item-caption">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      </div>
    `).join('');
  } else if (galleryGrid) {
    galleryGrid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add photos via the admin panel.</p>';
  }
}

async function initContactPage() {
  console.log('📧 Initializing contact page...');
  
  const content = await loadContentIndex();
  
  if (content.settings) {
    const s = content.settings;
    const els = {
      'contact-location': s.location,
      'contact-phone': s.phone,
      'contact-email': s.email
    };
    
    Object.entries(els).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '';
    });
  }
}

// Create news card HTML
function createNewsCard(item, detailed = false) {
  const date = new Date(item.date);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
  const basePath = getBasePath();
  
  if (detailed) {
    return `
      <div class="card" style="overflow:hidden">
        ${item.image ? `<img class="card-img" src="${basePath}${item.image}" alt="${item.title}" style="height:220px" onerror="this.style.display='none'"/>` : ''}
        <div class="card-body">
          <span class="news-tag">${item.category || 'News'}</span>
          <h3 style="font-size:1.15rem;margin:0.5rem 0">${item.title}</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7">${item.content}</p>
          <div style="display:flex;gap:1rem;margin-top:1rem;font-size:0.8rem;color:var(--text-muted);font-weight:700">
            <span>📅 ${date.toLocaleDateString()}</span>
            ${item.author ? `<span>👤 ${item.author}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="news-item">
      <div class="news-date-badge"><div class="day">${day}</div><div class="month">${month}</div></div>
      <div class="news-content">
        <span class="news-tag">${item.category || 'News'}</span>
        <h3>${item.title}</h3>
        <p>${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}</p>
      </div>
    </div>
  `;
}

// Handle contact form submission
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    // Use formsubmit.co (free email service, no backend needed!)
    const response = await fetch('https://formsubmit.co/ajax/contact@sehravillage.site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        subject: data.subject,
        message: data.message,
        _subject: `Contact Form: ${data.subject}`,
        _template: 'table'
      })
    });
    
    if (response.ok) {
      showToast('✅ Message sent! We\'ll be in touch soon.', 'success');
      form.reset();
    } else {
      throw new Error('Failed to send');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    showToast('✅ Message received! We\'ll respond soon.', 'success');
    form.reset(); // Still reset form for better UX
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// HOME PAGE
function getHomePage() {
  return `
<div class="hero">
  <div class="hero-pattern"></div>
  <div class="hero-content">
    <div class="hero-pill">🌙 Welcome to Our Village</div>
    <h1>Village of<br><span>Sehra</span></h1>
    <p>A warm, peaceful community in Azad Jammu & Kashmir — rich in culture, tradition, and natural beauty.</p>
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
      <div class="card">
        <img class="card-img" src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80" alt="Mosque"/>
        <div class="card-body">
          <div class="card-icon sky">🕌</div>
          <h3>Historic Mosque</h3>
          <p>The spiritual and social heart of the community — serving generations of Sehra families.</p>
          <div class="card-meta">📍 Village Center</div>
        </div>
      </div>
      <div class="card">
        <img class="card-img" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" alt="Fields"/>
        <div class="card-body">
          <div class="card-icon gold">🌾</div>
          <h3>Golden Farmlands</h3>
          <p>Rich agricultural fields of wheat, rice and vegetables — the backbone of our economy.</p>
          <div class="card-meta">🌱 Agriculture</div>
        </div>
      </div>
      <div class="card">
        <img class="card-img" src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" alt="School"/>
        <div class="card-body">
          <div class="card-icon green">🏫</div>
          <h3>Village School</h3>
          <p>Educating the next generation — building bright futures for Sehra's children.</p>
          <div class="card-meta">📚 Education</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section bg-white">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2rem">
      <div>
        <div class="section-tag">Latest</div>
        <h2 class="section-title">Village <span>News</span></h2>
      </div>
      <button class="btn btn-sky" onclick="navigateTo('news')">View All →</button>
    </div>
    <div class="news-list" id="latestNewsList"></div>
  </div>
</section>

<section class="section bg-sky-light">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
      <div>
        <div class="section-tag">Location</div>
        <h2 class="section-title">Find <span>Sehra</span> on the Map</h2>
      </div>
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

// ABOUT PAGE
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
        <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1rem">Sehra is a vibrant village in Azad Jammu & Kashmir, Pakistan. For generations, our families have worked the land, built homes, and created a community bonded by faith, tradition, and shared values.</p>
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
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🌅</div><h3>Rural Serenity</h3><p>Wake up to birdsong, fresh air, and open fields. Life in Sehra moves at a gentle, meaningful pace.</p></div></div>
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🍽️</div><h3>Traditional Cuisine</h3><p>Authentic Kashmiri & Punjabi flavors — fresh roti, hearty daal, and seasonal vegetables grown locally.</p></div></div>
      <div class="card"><div class="card-body" style="padding:2rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">🎊</div><h3>Festivals & Events</h3><p>From Eid to harvest festivals, Sehra comes alive with music, food, and community gatherings.</p></div></div>
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

// NEWS PAGE
function getNewsPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,#1a2738,var(--sky))">
  <h1>Village News & Events</h1>
  <p>Stay updated with the latest announcements, stories, and events in Sehra Village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>News</div></div>

<section class="section bg-light">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:2rem;align-items:start" class="news-layout">
      <div id="allNewsList"></div>
      
      <!-- SIDEBAR -->
      <div style="display:flex;flex-direction:column;gap:1.2rem">
        <div style="background:var(--white);border-radius:var(--radius);padding:1.4rem;box-shadow:var(--shadow)">
          <h4 style="font-size:0.8rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem">📂 Categories</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem" id="newsCategoriesList">
            <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:700;color:var(--sky);padding:0.4rem 0;border-bottom:1px solid var(--border)">All News <span style="background:var(--sky-light);padding:0.1rem 0.6rem;border-radius:20px" id="newsCount">0</span></div>
          </div>
        </div>
        
        <div id="noticeSidebar" style="background:var(--sky);border-radius:var(--radius);padding:1.4rem;color:#fff">
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 Notice</h4>
          <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">Village council meeting on <strong>May 1, 2026</strong> at the Community Hall. All residents welcome.</p>
        </div>
        
        <div id="upcomingSidebar" style="background:var(--gold-light);border-radius:var(--radius);padding:1.4rem;border:1px solid #f0c060">
          <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 Upcoming</h4>
          <p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">Eid celebration at Community Hall — <strong>June 2026</strong>. All families invited.</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

// GALLERY PAGE
function getGalleryPage() {
  return `
<div class="page-hero" style="background:linear-gradient(135deg,var(--green),#1a9fd4)">
  <h1>Village Gallery</h1>
  <p>A visual journey through the everyday life, landscapes, and beauty of Sehra Village.</p>
</div>
<div class="breadcrumb"><div class="breadcrumb-inner"><a onclick="navigateTo('home')">Home</a><span>›</span>Gallery</div></div>

<section class="section bg-light">
  <div class="container">
    <div class="gallery-grid" id="galleryGrid"></div>
  </div>
</section>`;
}

// CONTACT PAGE  
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
        <form id="contactForm" onsubmit="handleContactSubmit(event)">
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
          <button type="submit" class="btn btn-sky" style="width:100%;padding:0.9rem">Send Message ✉</button>
        </form>
      </div>
    </div>
  </div>
</section>`;
}

// Initialize functions for each page
async function initHomePage() {
  console.log('Initializing home page...');
  
  // Load stats from config
  const statPop = document.getElementById('stat-population');
  const statHist = document.getElementById('stat-history');
  const statProv = document.getElementById('stat-province');
  const statCountry = document.getElementById('stat-country');
  
  if (statPop) statPop.textContent = siteConfig.population;
  if (statHist) statHist.textContent = siteConfig.yearsHistory;
  if (statProv) statProv.textContent = siteConfig.province;
  if (statCountry) statCountry.textContent = siteConfig.country;
  
  // Update map info
  const mapLocation = document.getElementById('map-location');
  const mapProvince = document.getElementById('map-province');
  const mapCity = document.getElementById('map-city');
  
  if (mapLocation) mapLocation.textContent = siteConfig.location;
  if (mapProvince) mapProvince.textContent = siteConfig.province;
  if (mapCity) mapCity.textContent = siteConfig.nearestCity;
  
  // Load latest 3 news with GitHub API fallback
  await loadAndDisplayNews(true);
  
  // Load main cards
  await loadAndDisplayMainCards();
}

async function initAboutPage() {
  console.log('Initializing about page...');

  // Load settings from CMS (settings/site.json served statically on Netlify)
  try {
    const response = await fetch(`/settings/site.json?_=${Date.now()}`);
    if (response.ok) {
      const s = await response.json();

      const els = {
        'about-population': s.population,
        'about-history':    s.yearsHistory,
        'about-schools':    s.schools,
        'about-mosques':    s.mosques,
        'about-province':   s.province,
        'about-country':    s.country,
        'about-city':       s.nearestCity,
        'about-location':   s.location
      };

      Object.entries(els).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
      });

      console.log('About page settings loaded:', s);
    }
  } catch (error) {
    console.log('About page using default settings:', error);
  }
}

// Load and display news
async function loadAndDisplayNews(homePageOnly = false) {
  const basePath = getBasePath();
  const newsList = homePageOnly ? document.getElementById('latestNewsList') : document.getElementById('allNewsList');
  
  if (!newsList) return;
  
  try {
    // Try to load from GitHub API
    const repoOwner = 'mhadix';
    const repoName = 'sehra-village';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/news`;
    
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const files = await response.json();
      const newsPromises = files
        .filter(file => file.name.endsWith('.json'))
        .map(file => fetch(file.download_url).then(r => r.json()));
      
      const newsItems = await Promise.all(newsPromises);
      
      // Sort by date (newest first)
      newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Display news
      const itemsToShow = homePageOnly ? newsItems.slice(0, 3) : newsItems;
      
      if (itemsToShow.length > 0) {
        newsList.innerHTML = itemsToShow.map(item => createNewsCard(item, !homePageOnly)).join('');
      } else {
        newsList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news available yet. Add news via the admin panel.</p>';
      }
      
      // Update news count
      const newsCount = document.getElementById('newsCount');
      if (newsCount) newsCount.textContent = newsItems.length;
      
      console.log(`Loaded ${itemsToShow.length} news items`);
    } else {
      throw new Error('GitHub API failed');
    }
  } catch (error) {
    console.log('Using fallback news:', error);
    newsList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No news available yet. Add news via the admin panel.</p>';
  }
}

// Load and display main cards
async function loadAndDisplayMainCards() {
  const basePath = getBasePath();
  const cardsGrid = document.getElementById('mainCardsGrid');
  
  if (!cardsGrid) return;
  
  try {
    const repoOwner = 'mhadix';
    const repoName = 'sehra-village';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/main-cards`;
    
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const files = await response.json();
      const cardsPromises = files
        .filter(file => file.name.endsWith('.json'))
        .map(file => fetch(file.download_url).then(r => r.json()));
      
      const cards = await Promise.all(cardsPromises);
      
      // Sort by order
      cards.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      // Display cards
      if (cards.length > 0) {
        cardsGrid.innerHTML = cards.map(card => `
          <div class="card">
            <img class="card-img" src="${basePath}${card.image}" alt="${card.title}"/>
            <div class="card-body">
              <div class="card-icon ${card.iconColor || 'sky'}">${card.icon || '🏡'}</div>
              <h3>${card.title}</h3>
              <p>${card.description}</p>
              ${card.meta ? `<div class="card-meta">${card.meta}</div>` : ''}
            </div>
          </div>
        `).join('');
        
        console.log(`Loaded ${cards.length} main cards`);
      }
    }
  } catch (error) {
    console.log('Using default cards:', error);
  }
}

async function initNewsPage() {
  console.log('Initializing news page...');
  
  // Load all news
  await loadAndDisplayNews(false);
  
  // Load notice and upcoming from GitHub
  await loadNoticeAndUpcoming();
}

async function loadNoticeAndUpcoming() {
  const basePath = getBasePath();
  const repoOwner = 'mhadix';
  const repoName = 'sehra-village';
  
  // Load notice
  try {
    const noticeUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/notice.json`;
    const response = await fetch(noticeUrl);
    
    if (response.ok) {
      const fileData = await response.json();
      const noticeResponse = await fetch(fileData.download_url);
      const notice = await noticeResponse.json();
      
      if (notice && notice.enabled) {
        const noticeSidebar = document.getElementById('noticeSidebar');
        if (noticeSidebar) {
          noticeSidebar.innerHTML = `
            <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8;margin-bottom:0.6rem">📢 ${notice.title || 'Notice'}</h4>
            <p style="font-size:0.88rem;line-height:1.6;opacity:0.9">${notice.content}</p>
          `;
        }
      }
    }
  } catch (error) {
    console.log('No notice found');
  }
  
  // Load upcoming
  try {
    const upcomingUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/upcoming.json`;
    const response = await fetch(upcomingUrl);
    
    if (response.ok) {
      const fileData = await response.json();
      const upcomingResponse = await fetch(fileData.download_url);
      const upcoming = await upcomingResponse.json();
      
      if (upcoming && upcoming.enabled) {
        const upcomingSidebar = document.getElementById('upcomingSidebar');
        if (upcomingSidebar) {
          upcomingSidebar.innerHTML = `
            <h4 style="font-size:0.78rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem">🎉 ${upcoming.title || 'Upcoming'}</h4>
            <p style="font-size:0.88rem;line-height:1.6;color:var(--text-muted)">${upcoming.content}</p>
          `;
        }
      }
    }
  } catch (error) {
    console.log('No upcoming event found');
  }
}

async function initGalleryPage() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  try {
    const repoOwner = 'mhadix';
    const repoName = 'sehra-village';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/gallery`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('GitHub API failed');

    const files = await response.json();
    const items = await Promise.all(
      files
        .filter(f => f.name.endsWith('.json'))
        .map(f => fetch(f.download_url).then(r => r.json()))
    );

    items.sort((a, b) => (a.order || 999) - (b.order || 999));

    if (items.length > 0) {
      galleryGrid.innerHTML = items.map(item => `
        <div class="g-item">
          <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'"/>
          <div class="g-item-caption">
            <h4>${item.title}</h4>
            <p>${item.description || ''}</p>
          </div>
        </div>
      `).join('');
    } else {
      galleryGrid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add photos via the admin panel.</p>';
    }
  } catch (error) {
    console.log('Gallery load error:', error);
    galleryGrid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem">No photos yet. Add photos via the admin panel.</p>';
  }
}

function initContactPage() {
  document.getElementById('contact-location').textContent = siteConfig.location;
  document.getElementById('contact-phone').textContent = siteConfig.phone;
  document.getElementById('contact-email').textContent = siteConfig.email;
}

// Create news card HTML
function createNewsCard(item, detailed = false) {
  const date = new Date(item.date);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
  
  if (detailed) {
    return `
      <div class="card" style="overflow:hidden">
        ${item.image ? `<img class="card-img" src="${item.image}" alt="${item.title}" style="height:220px"/>` : ''}
        <div class="card-body">
          <span class="news-tag">${item.category || 'News'}</span>
          <h3 style="font-size:1.15rem;margin:0.5rem 0">${item.title}</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7">${item.content}</p>
          <div style="display:flex;gap:1rem;margin-top:1rem;font-size:0.8rem;color:var(--text-muted);font-weight:700">
            <span>📅 ${date.toLocaleDateString()}</span>
            ${item.author ? `<span>👤 ${item.author}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="news-item">
      <div class="news-date-badge"><div class="day">${day}</div><div class="month">${month}</div></div>
      <div class="news-content">
        <span class="news-tag">${item.category || 'News'}</span>
        <h3>${item.title}</h3>
        <p>${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}</p>
      </div>
    </div>
  `;
}

// Handle contact form submission
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      showToast('✅ Message sent! We\'ll be in touch soon.', 'success');
      form.reset();
    } else {
      throw new Error('Failed to send');
    }
  } catch (error) {
    showToast('❌ Failed to send message. Please try again.', 'error');
  }
}