// notifications.js — Push notifications for Sehra Village
// Uses Web Push API. VAPID public key matches the private key set in Netlify env vars.

const VAPID_PUBLIC_KEY = 'BAqvL1NjrCa42Q1mm-oB_15pMEpbj4onjqSxsZBvXUqwZAdVnsJ_lmSf3gXVOeaRimJMRuhU6KNGJXra2taCO_I';

// Show banner 5s after load if permission not yet decided
window.addEventListener('load', () => {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default' && !localStorage.getItem('notif-dismissed')) {
    setTimeout(() => {
      const b = document.getElementById('notificationBanner');
      if (b) b.style.display = 'flex';
    }, 5000);
  }
});

async function requestNotificationPermission() {
  const banner = document.getElementById('notificationBanner');
  if (!('Notification' in window)) { showToast('Notifications not supported on this device', 'error'); return; }

  const perm = await Notification.requestPermission();
  if (banner) banner.style.display = 'none';
  localStorage.setItem('notif-dismissed', '1');

  if (perm === 'granted') {
    showToast('🔔 Notifications enabled!', 'success');
    await subscribeToPush();
    new Notification('Welcome to Sehra Village! 🏡', {
      body: 'You will now receive village news and updates.',
      icon: '/img/icon-192.png'
    });
    // Start checking for new content
    localStorage.setItem('last-news-check', Date.now().toString());
    setInterval(checkForNewContent, 30 * 60 * 1000);
  } else {
    showToast('Notifications blocked. You can enable them in browser settings.', 'error');
  }
}

function dismissNotificationBanner() {
  const b = document.getElementById('notificationBanner');
  if (b) b.style.display = 'none';
  localStorage.setItem('notif-dismissed', '1');
}

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    await fetch('/.netlify/functions/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub)
    });
  } catch(e) {
    console.warn('Push subscribe failed:', e.message);
  }
}

// Check content-index.json for new news since last check
async function checkForNewContent() {
  if (Notification.permission !== 'granted') return;
  try {
    const res = await fetch(`/content-index.json?t=${Date.now()}`);
    if (!res.ok) return;
    const data = await res.json();
    if (!data.news || data.news.length === 0) return;

    const lastCheck = parseInt(localStorage.getItem('last-news-check') || '0');
    const latest = data.news[0]; // already sorted newest-first by build-index.js
    const newsTime = new Date(latest.date).getTime();

    if (newsTime > lastCheck && lastCheck > 0) {
      new Notification('New Village News! 📰', {
        body: latest.title,
        icon: '/img/icon-192.png',
        tag: 'sehra-news'
      });
    }
    localStorage.setItem('last-news-check', Date.now().toString());
  } catch(e) { /* silent */ }
}

// Resume periodic check if already granted
if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
  checkForNewContent();
  setInterval(checkForNewContent, 30 * 60 * 1000);
}

function urlBase64ToUint8Array(b64) {
  const pad = '='.repeat((4 - b64.length % 4) % 4);
  const base64 = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
