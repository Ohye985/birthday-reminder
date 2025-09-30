// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodeCron = require('node-cron');
const sgMail = require("@sendgrid/mail");

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

// Sendgrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use('/api', routes);

app.get('/', (req, res) => res.send('Birthday Wisher API is running'));

// Sendgrid Birthday Email Function
async function sendBirthdayEmail(user) {
  if (!user.email || typeof user.email !== "string") {
    console.error(`[MAILER] Skipped: invalid email for user ${user.username}`);
    return;
  }

  const recipient = user.email.trim();
  if (!recipient) {
    console.error(`[MAILER] Skipped: empty email for user ${user.username}`);
    return;
  }

  const msg = {
    to: user.email,
    from: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME || "Birthday Wisher",
    },
    subject: "Happy Birthday! 🎉",
    text: `Happy Birthday, ${user.username}! 🎂`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1>🎉 Happy Birthday, ${user.username}! 🎂</h1>
        <p>Wishing you joy, happiness, and success today and always.</p>
        <p style="margin-top: 30px;">— Ohye Enterprise</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`[MAILER] Sent birthday email to ${user.email}`);
  } catch (error) {
    console.error("[MAILER] Error sending email:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
  }
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
          await sendBirthdayEmail(u);
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
