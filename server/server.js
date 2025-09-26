// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');

const connectDB = require('./db');
const routes = require('./routes');
const User = require('./models/User');

const PORT = process.env.PORT || 4000;
const CRON_TIME = process.env.CRON_TIME || '0 7 * * *';
const CRON_TZ = process.env.CRON_TZ || Intl.DateTimeFormat().resolvedOptions().timeZone;

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => res.send('Birthday Wisher API is running'));

// Setup nodemailer transporter (Gmail)
// For production consider a dedicated transactional email provider
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// send email helper
async function sendBirthdayEmail(toEmail, username) {
  const fromName = process.env.FROM_NAME || 'Birthday Team';
  const mailOptions = {
    from: `${fromName} <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Happy Birthday, ${username}! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.4;">
        <h2 style="margin-bottom:0.2rem">Happy Birthday, ${username} 🎂</h2>
        <p>Wishing you a joyful day filled with love, laughter, and cake.</p>
        <p><em>Warm wishes from ${fromName}.</em></p>
        <hr />
        <small>If you no longer want these emails, reply with 'unsubscribe'.</small>
      </div>
    `
  };

  return transport.sendMail(mailOptions, function(error, info) {
    if (error) {
    console.log(`Error: ${error}`);
  } else {
    console.log('Email sent: ' + info.response);
  }
  });
}

// Cron job — runs at CRON_TIME daily
nodeCron.schedule(
  CRON_TIME,
  async () => {
    console.log('[CRON] Running birthday check at', new Date().toISOString());
    try {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const regex = new RegExp(`-${mm}-${dd}$`);
      const users = await User.find({ dob: { $regex: regex } }).lean();

      if (!users || users.length === 0) {
        console.log('[CRON] No birthdays today');
        return;
      }

      console.log(`[CRON] Sending ${users.length} birthday email(s)`);
      for (const u of users) {
        try {
          await sendBirthdayEmail(u.email, u.username);
          console.log(`[CRON] Sent email to ${u.email}`);
        } catch (err) {
          console.error(`[CRON] Error sending to ${u.email}:`, err);
        }
      }
    } catch (err) {
      console.error('[CRON] Error during birthday check:', err);
    }
  },
  {
    scheduled: true,
    timezone: CRON_TZ
  }
);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
