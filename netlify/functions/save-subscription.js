exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: '' };
  try {
    const sub = JSON.parse(event.body);
    console.log('Push subscription received:', sub.endpoint?.slice(0, 50));
    // Save to FaunaDB if configured; otherwise just acknowledge
    if (process.env.FAUNA_SECRET) {
      const faunadb = require('faunadb');
      const q = faunadb.query;
      const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
      await client.query(q.Create(q.Collection('push_subscriptions'), { data: sub }));
    }
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch(e) {
    console.error(e);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }; // never fail client
  }
};
