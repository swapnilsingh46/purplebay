// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  avatar: { type: String }, // add avatar path (e.g. "/uploads/avatar-123.jpg")
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

