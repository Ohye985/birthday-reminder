# 🎉 Birthday Wisher App

A simple full-stack app to automatically send birthday wishes to users via email every day at **7 AM**.  
Built with **React (frontend)**, **Node.js + Express (backend)**, and **MongoDB**.

---

## ✨ Features
- Collect **username, email, and date of birth** via a React form.
- Store users in a MongoDB database (with unique email enforcement).
- A **cron job** runs daily at **7 AM** to:
  - Check whose birthday it is today.
  - Send personalized birthday emails using **Nodemailer + Gmail**.
- Simple UI showing:
  - Form to add users.
  - Table of saved users.
  - List of today’s celebrants.

---

## 🛠️ Tech Stack
- **Frontend**: React, Fetch API
- **Backend**: Node.js, Express, Nodemailer, Node-Cron
- **Database**: MongoDB + Mongoose
- **Email Provider**: Gmail (App Passwords required)

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
GMAIL_USER=yourgmail@gmail.com
GMAIL_PASS=your_app_password
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