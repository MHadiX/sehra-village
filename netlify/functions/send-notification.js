// Send push notifications to all subscribers
// Requires env vars: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
// Optional: FAUNA_SECRET (to fetch stored subscriptions from DB)
const webpush = require('web-push');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'VAPID keys not configured in Netlify environment variables' }) };
  }

  webpush.setVapidDetails(
    'mailto:contact@sehravillage.site',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  try {
    const { title, body, icon, url } = JSON.parse(event.body);
    const payload = JSON.stringify({ title, body, icon: icon || '/img/icon-192.png', badge: '/img/icon-192.png', url: url || '/' });

    // Get subscriptions from FaunaDB if configured
    let subscriptions = [];
    if (process.env.FAUNA_SECRET) {
      const faunadb = require('faunadb');
      const q = faunadb.query;
      const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
      const result = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('push_subscriptions'))),
          q.Lambda('ref', q.Get(q.Var('ref')))
        )
      );
      subscriptions = result.data.map(item => item.data);
    }

    if (subscriptions.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'No subscribers yet', sent: 0 }) };
    }

    const results = await Promise.allSettled(
      subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    return { statusCode: 200, headers, body: JSON.stringify({ message: `Sent to ${sent}/${subscriptions.length} subscribers`, sent }) };

  } catch (error) {
    console.error('send-notification error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
