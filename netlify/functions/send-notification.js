// Send web push to all saved subscribers
// Requires: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, FAUNA_SECRET
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: '' };

  const missingVars = ['VAPID_PUBLIC_KEY','VAPID_PRIVATE_KEY','FAUNA_SECRET'].filter(v => !process.env[v]);
  if (missingVars.length) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: `Missing env vars: ${missingVars.join(', ')}` }) };
  }

  try {
    const webpush = require('web-push');
    webpush.setVapidDetails('mailto:contact@sehravillage.site', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

    const { title, body, icon, url } = JSON.parse(event.body);
    const payload = JSON.stringify({ title, body, icon: icon || '/img/icon-192.png', url: url || '/' });

    const faunadb = require('faunadb');
    const q = faunadb.query;
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
    const result = await client.query(q.Map(q.Paginate(q.Documents(q.Collection('push_subscriptions'))), q.Lambda('r', q.Get(q.Var('r')))));
    const subs = result.data.map(d => d.data);

    const results = await Promise.allSettled(subs.map(s => webpush.sendNotification(s, payload)));
    const sent = results.filter(r => r.status === 'fulfilled').length;
    return { statusCode: 200, headers, body: JSON.stringify({ sent, total: subs.length }) };
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
