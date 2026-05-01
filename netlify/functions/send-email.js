// Backup email sender via Gmail SMTP
// Requires Netlify env vars: EMAIL_USER, EMAIL_PASS (Gmail App Password)
// Primary contact form uses Netlify Forms (no backend needed)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: 'Email not configured — use Netlify Forms instead' }) };
  }

  try {
    const nodemailer = require('nodemailer');
    const { firstName, lastName, email, subject, message } = JSON.parse(event.body);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Sehra Contact] ${subject}`,
      html: `<h2>Contact Form</h2><p><b>Name:</b> ${firstName} ${lastName}</p><p><b>Email:</b> ${email}</p><p><b>Subject:</b> ${subject}</p><p><b>Message:</b><br>${message.replace(/\n/g,'<br>')}</p>`
    });
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
