// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html, style.css, script.js

// ===== MONGODB CONNECTION =====
const mongoURI = 'mongodb+srv://Brenda:18atlast@cluster0.l4i1nyh.mongodb.net/brendaAppDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== SCHEMAS =====
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// ===== ROUTES =====

// Sign Up
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, error: 'Username & password required' });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ success: false, error: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: 'Server error during signup' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, error: 'Username & password required' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, error: 'Incorrect password' });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: 'Server error during login' });
  }
});

// Post a message
app.post('/api/messages', async (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) return res.status(400).json({ success: false, error: 'Invalid data' });

  try {
    await Message.create({ username, message });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error saving message' });
  }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error fetching messages' });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
