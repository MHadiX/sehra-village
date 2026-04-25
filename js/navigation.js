// Page navigation with history support
const pages = ['home', 'about', 'news', 'gallery', 'contact'];
let currentPage = 'home';

// Navigate to a page
function navigateTo(pageName) {
  if (!pages.includes(pageName)) pageName = 'home';
  
  currentPage = pageName;
  
  // Update URL without reload
  const url = pageName === 'home' ? '/' : `/#${pageName}`;
  window.history.pushState({ page: pageName }, '', url);
  
  // Load page content
  loadPage(pageName);
  
  // Update active nav item
  updateActiveNav(pageName);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load page content
async function loadPage(pageName) {
  const contentDiv = document.getElementById('pageContent');
  
  // Directly use local page templates
  contentDiv.innerHTML = fetchLocalPage(pageName);
  
  // Execute page-specific scripts after content is loaded
  setTimeout(() => {
    if (pageName === 'home') initHomePage();
    if (pageName === 'news') initNewsPage();
    if (pageName === 'gallery') initGalleryPage();
    if (pageName === 'contact') initContactPage();
  }, 100);
}

// Fallback: load inline page content
function fetchLocalPage(pageName) {
  const pageTemplates = {
    home: getHomePage(),
    about: getAboutPage(),
    news: getNewsPage(),
    gallery: getGalleryPage(),
    contact: getContactPage()
  };
  
  return pageTemplates[pageName] || pageTemplates.home;
}

// Update active navigation item
function updateActiveNav(pageName) {
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach((link, index) => {
    link.classList.toggle('active', pages[index] === pageName);
  });
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
  const page = event.state?.page || getPageFromHash();
  loadPage(page);
  updateActiveNav(page);
});

// Get page from URL hash
function getPageFromHash() {
  const hash = window.location.hash.slice(1);
  return pages.includes(hash) ? hash : 'home';
}

// Mobile menu toggle
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  const initialPage = getPageFromHash();
  navigateTo(initialPage);
});
