// Site configuration loaded from Netlify CMS
const siteConfig = {
  // Default values - will be overridden by CMS data
  siteName: "Sehra Village",
  location: "Sehra Village, AJK, Pakistan",
  phone: "+92 300 0000000",
  email: "contact@sehravillage.site",
  province: "AJK",
  country: "Pakistan",
  population: "5,000+",
  yearsHistory: "100+",
  schools: "3",
  mosques: "1",
  nearestCity: "Muzaffarabad",

  // Map coordinates for AJK
  mapLat: 34.37,
  mapLng: 73.47,
  mapZoom: 11
};

// Load site settings from CMS
async function loadSiteSettings() {
  try {
    const response = await fetch(`/settings/site.json?_=${Date.now()}`);
    if (response.ok) {
      const data = await response.json();
      Object.assign(siteConfig, data);
      updateSiteSettings();
      console.log('Settings loaded successfully');
    }
  } catch (error) {
    console.log('Using default settings');
  }
}

// Update UI with loaded settings
function updateSiteSettings() {
  const topbarLocation = document.getElementById('topbar-location');
  const topbarPhone = document.getElementById('topbar-phone');
  const topbarEmail = document.getElementById('topbar-email');

  if (topbarLocation) topbarLocation.textContent = siteConfig.location;
  if (topbarPhone) topbarPhone.textContent = siteConfig.phone;
  if (topbarEmail) topbarEmail.textContent = siteConfig.email;

  const footerPhone = document.getElementById('footer-phone');
  const footerEmail = document.getElementById('footer-email');

  if (footerPhone) footerPhone.textContent = siteConfig.phone;
  if (footerEmail) footerEmail.textContent = siteConfig.email;

  console.log('UI updated with settings');
}

// Reload settings every 30 seconds
setInterval(loadSiteSettings, 30000);

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSiteSettings);
} else {
  loadSiteSettings();
}
