// Save push notification subscription to database
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const subscription = JSON.parse(event.body);
    
    // Initialize FaunaDB client (or use any database)
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET // Set in Netlify environment variables
    });
    
    // Save subscription to database
    await client.query(
      q.Create(
        q.Collection('push_subscriptions'),
        { data: subscription }
      )
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription saved' })
    };
    
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
