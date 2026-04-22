// PWA Installation
let deferredPrompt;
const pwaBanner = document.getElementById('pwaBanner');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install banner if not dismissed before
  if (!localStorage.getItem('pwa-dismissed')) {
    setTimeout(() => {
      pwaBanner.style.display = 'block';
    }, 3000);
  }
});

async function installPWA() {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('PWA installed');
    showToast('App installed successfully! 📱', 'success');
  }
  
  deferredPrompt = null;
  pwaBanner.style.display = 'none';
}

function dismissPWABanner() {
  pwaBanner.style.display = 'none';
  localStorage.setItem('pwa-dismissed', 'true');
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}
