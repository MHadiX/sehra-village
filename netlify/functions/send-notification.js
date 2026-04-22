// Send push notifications to all subscribers
const webpush = require('web-push');
const faunadb = require('faunadb');
const q = faunadb.query;

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:contact@sehravillage.site',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.handler = async (event, context) => {
  // This should be called by Netlify CMS webhook when new content is published
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const data = JSON.parse(event.body);
    const { title, body, icon, url } = data;
    
    // Get all subscriptions from database
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET
    });
    
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('push_subscriptions'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );
    
    const subscriptions = result.data.map(item => item.data);
    
    // Send notification to all subscribers
    const notificationPayload = JSON.stringify({
      title: title,
      body: body,
      icon: icon || '/img/icon-192.png',
      badge: '/img/icon-192.png',
      url: url || '/'
    });
    
    const sendPromises = subscriptions.map(subscription =>
      webpush.sendNotification(subscription, notificationPayload)
        .catch(error => {
          console.error('Send error:', error);
          // Remove invalid subscriptions
          if (error.statusCode === 410) {
            // Subscription expired, remove from database
          }
        })
    );
    
    await Promise.all(sendPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Sent to ${subscriptions.length} subscribers` })
    };
    
  } catch (error) {
    console.error('Notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
