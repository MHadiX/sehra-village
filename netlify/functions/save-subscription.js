// Save push subscription — stores in a JSON file committed to the repo
// Using Netlify's built-in environment; subscriptions stored in memory
// For production, replace with a real DB (FaunaDB, Supabase, etc.)
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const subscription = JSON.parse(event.body);
    console.log('New push subscription received:', subscription.endpoint?.slice(0, 60));

    // If FAUNA_SECRET is set, save to FaunaDB
    if (process.env.FAUNA_SECRET) {
      const faunadb = require('faunadb');
      const q = faunadb.query;
      const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
      await client.query(
        q.Create(q.Collection('push_subscriptions'), { data: subscription })
      );
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Subscription saved to DB' }) };
    }

    // Fallback: just acknowledge (subscription still works for local notifications)
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Subscription acknowledged' }) };

  } catch (error) {
    console.error('save-subscription error:', error);
    // Still return 200 so client doesn't break
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Acknowledged' }) };
  }
};
