// server/routes.js
const express = require('express');
const router = express.Router();
const User = require('./models/User');

// Create user
router.post('/users', async (req, res) => {
  const { username, email, dob } = req.body;
  if (!username || !email || !dob) return res.status(400).json({ error: 'Missing fields' });

  try {
    const u = new User({
      username: username,
      email: email.toLowerCase(),
      dob: dob // expect 'YYYY-MM-DD' from client
    });
    await u.save();
    res.json(u);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Create user error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error('Get users error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete user error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Optional: endpoint to preview today's birthday celebrants
router.get('/today', async (req, res) => {
  try {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    // match -MM-DD at end of dob string 'YYYY-MM-DD'
    const regex = new RegExp(`-${mm}-${dd}$`);
    const users = await User.find({ dob: { $regex: regex } }).lean();
    res.json(users);
  } catch (err) {
    console.error('Today endpoint error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
