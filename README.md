# 🎉 Birthday Wisher App

A simple full-stack app to automatically send birthday wishes to users via email every day at **7 AM**.  
Built with **React (frontend)**, **Node.js + Express (backend)**, and **MongoDB**.

---

## ✨ Features
- Collect **username, email, and date of birth** via a React form.
- Store users in a MongoDB database (with unique email enforcement).
- A **cron job** runs daily at **7 AM** to:
  - Check whose birthday it is today.
  - Sends a **Happy Birthday email** using **SendGrid (email delivery)**.
- Simple UI showing:
  - Form to add users.
  - Table of saved users.
  - List of today’s celebrants.

---

## 🛠️ Tech Stack
- **Frontend**: React, Fetch API
- **Backend**: Node.js, Express, Node-Cron
- **Database**: MongoDB + Mongoose
- **Email Service**: Sendgrid

---

## 🚀 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/birthday-reminder.git
cd birthday-reminder
```

### 2. Install dependencies

```bash
Backend
cd server
npm install

Frontend
cd ../client
npm install
```

### 3. Configure environment (.env)

PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/birthday_reminder
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=no-reply@yourdomain.com
FROM_NAME=Your Business Name
CRON_TIME=0 7 * * *

### 4. Run the servers

```bash

# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm start
```

## 📬 Usage

- Visit http://localhost:3000.

- Add a new user with username, email, and DOB.

- Users will appear in the table.

- At 7 AM daily, the cron job will:

- Find birthdays that match today.

- Send a personalized birthday email.

## 📌 Example API Endpoints

- POST /api/users → Create a new user

- GET /api/users → List all users

- DELETE /api/users/:id → Delete a user