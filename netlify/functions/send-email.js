// Contact form email sender
// Requires Netlify env vars: EMAIL_USER, EMAIL_PASS (Gmail App Password)
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { firstName, lastName, email, subject, message } = JSON.parse(event.body);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('EMAIL_USER or EMAIL_PASS not set in Netlify environment variables');
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Email not configured' }) };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'contact@sehravillage.site',
      replyTo: email,
      subject: `[Sehra Contact] ${subject}`,
      html: `<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g,'<br>')}</p>`
    });

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email sent' }) };
  } catch (error) {
    console.error('send-email error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
