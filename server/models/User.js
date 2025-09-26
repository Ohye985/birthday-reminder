// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    dob: { type: String, required: true, trim: true } // store as 'YYYY-MM-DD'
  },
  { timestamps: true }
);

// ensure unique index on email
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
