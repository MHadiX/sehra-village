// ============================================================
// SEHRA VILLAGE — notifications.js
// Push notifications using Web Push API + Netlify Functions
// VAPID keys must be set in Netlify environment variables:
//   VAPID_PUBLIC_KEY  = BAqvL1NjrCa42Q1mm-oB_15pMEpbj4onjqSxsZBvXUqwZAdVnsJ_lmSf3gXVOeaRimJMRuhU6KNGJXra2taCO_I
//   VAPID_PRIVATE_KEY = Kpzuz1FJJJjXuJ2vy53VAD4N9WXPUsoeG4bvxsJzaEY
// ============================================================

const VAPID_PUBLIC_KEY = 'BAqvL1NjrCa42Q1mm-oB_15pMEpbj4onjqSxsZBvXUqwZAdVnsJ_lmSf3gXVOeaRimJMRuhU6KNGJXra2taCO_I';

// Show notification permission banner after 5s (if not already decided)
window.addEventListener('load', () => {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default' && !localStorage.getItem('notif-dismissed')) {
    setTimeout(() => {
      const banner = document.getElementById('notificationBanner');
      if (banner) banner.style.display = 'block';
    }, 5000);
  }
});

async function requestNotificationPermission() {
  const banner = document.getElementById('notificationBanner');
  if (!('Notification' in window)) {
    showToast('Notifications not supported on this device', 'error');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    if (banner) banner.style.display = 'none';
    localStorage.setItem('notif-dismissed', 'true');
    showToast('🔔 Notifications enabled!', 'success');
    await subscribeToPush();
    // Welcome notification
    new Notification('Welcome to Sehra Village! 🏡', {
      body: 'You will now receive village news and event updates.',
      icon: '/img/icon-192.png'
    });
  } else {
    if (banner) banner.style.display = 'none';
    localStorage.setItem('notif-dismissed', 'true');
    showToast('Notifications blocked. Enable in browser settings.', 'error');
  }
}

function dismissNotificationBanner() {
  const banner = document.getElementById('notificationBanner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('notif-dismissed', 'true');
}

// Subscribe to Web Push
async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Save subscription to Netlify Function
    const res = await fetch('/.netlify/functions/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    if (res.ok) {
      console.log('Push subscription saved');
    } else {
      console.warn('Push subscription save returned:', res.status);
    }
  } catch (error) {
    console.error('Push subscription failed:', error);
    // Don't show error to user — notifications still work locally
  }
}

// Check for new content and send local notification
// Runs every 30 minutes if permission granted
async function checkForNewContent() {
  if (Notification.permission !== 'granted') return;

  try {
    const lastCheck = parseInt(localStorage.getItem('last-news-check') || '0');
    const files = await fetch(
      `https://api.github.com/repos/mhadix/sehra-village/contents/content/news`
    ).then(r => r.json());

    if (!Array.isArray(files) || files.length === 0) return;

    // Get latest file by name (dates are in filenames: YYYY-MM-DD-slug.json)
    const sorted = files
      .filter(f => f.name.endsWith('.json'))
      .sort((a,b) => b.name.localeCompare(a.name));

    if (sorted.length === 0) return;

    const latest = await fetch(sorted[0].download_url).then(r => r.json());
    const newsTime = new Date(latest.date).getTime();

    if (newsTime > lastCheck && lastCheck > 0) {
      new Notification('New Village News! 📰', {
        body: latest.title,
        icon: '/img/icon-192.png',
        badge: '/img/icon-192.png',
        tag: 'news-update'
      });
    }

    localStorage.setItem('last-news-check', Date.now().toString());
  } catch(e) {
    console.log('News check skipped:', e.message);
  }
}

// Start periodic check
if ('Notification' in window && Notification.permission === 'granted') {
  checkForNewContent();
  setInterval(checkForNewContent, 30 * 60 * 1000);
}

// VAPID key helper
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output  = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}
