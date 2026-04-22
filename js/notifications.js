// Push Notifications System
const notificationBanner = document.getElementById('notificationBanner');

// Check notification permission on load
window.addEventListener('load', () => {
  if ('Notification' in window && Notification.permission === 'default') {
    // Show notification banner after 5 seconds
    if (!localStorage.getItem('notification-dismissed')) {
      setTimeout(() => {
        notificationBanner.style.display = 'block';
      }, 5000);
    }
  }
});

// Request notification permission
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported on this device', 'error');
    return;
  }
  
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    showToast('Notifications enabled! 🔔', 'success');
    notificationBanner.style.display = 'none';
    
    // Subscribe to push notifications
    subscribeToPush();
    
    // Show welcome notification
    showNotification('Welcome to Sehra Village!', {
      body: 'You will now receive updates about village news and events.',
      icon: '/img/icon-192.png',
      badge: '/img/icon-192.png'
    });
  } else {
    showToast('Notification permission denied', 'error');
    notificationBanner.style.display = 'none';
  }
}

function dismissNotificationBanner() {
  notificationBanner.style.display = 'none';
  localStorage.setItem('notification-dismissed', 'true');
}

// Subscribe to push notifications
async function subscribeToPush() {
  if (!('serviceWorker' in navigator)) return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // For now, we'll use a simple subscription
    // In production, you'd use VAPID keys
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib37gp2NOGIcQ9QdHsEE5ygH8vjhCkLzVY7vJLlpJ0MXXr5wJFlV9YzPNFk'
      )
    });
    
    // Save subscription to your backend
    await saveSubscription(subscription);
    
  } catch (error) {
    console.error('Push subscription failed:', error);
  }
}

// Helper function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Save subscription to backend (Netlify Function)
async function saveSubscription(subscription) {
  try {
    await fetch('/.netlify/functions/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  } catch (error) {
    console.error('Failed to save subscription:', error);
  }
}

// Show local notification
function showNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/img/icon-192.png',
      badge: '/img/icon-192.png',
      ...options
    });
  }
}

// Listen for new content from CMS
let lastNewsCheck = Date.now();

async function checkForNewContent() {
  try {
    const response = await fetch('/content/news.json');
    if (response.ok) {
      const news = await response.json();
      
      // Check if there's new content
      const latestNews = news[0];
      const newsTime = new Date(latestNews.date).getTime();
      
      if (newsTime > lastNewsCheck) {
        showNotification('New Village News! 📰', {
          body: latestNews.title,
          tag: 'news-update',
          requireInteraction: false
        });
        lastNewsCheck = newsTime;
      }
    }
  } catch (error) {
    console.log('No new content');
  }
}

// Check for updates every 30 minutes
if (Notification.permission === 'granted') {
  setInterval(checkForNewContent, 30 * 60 * 1000);
}
