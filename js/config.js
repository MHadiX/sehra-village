// Global site config — defaults shown until CMS settings load
const siteConfig = {
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
  mapLat: 34.37,
  mapLng: 73.47
};

function updateSiteSettings() {
  const ids = {
    'topbar-location': siteConfig.location,
    'topbar-phone': siteConfig.phone,
    'topbar-email': siteConfig.email,
    'footer-phone': siteConfig.phone,
    'footer-email': siteConfig.email
  };
  Object.entries(ids).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}
