// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve HTML/CSS/JS

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

// --- Signup ---
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, error: 'Username & password required' });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ success: false, error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log(`✅ New user signed up: ${username}`);
    res.json({ success: true, message: 'Signup successful!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Server error during signup' });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, error: 'Username & password required' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, error: 'Incorrect password' });

    console.log(`✅ User logged in: ${username}`);
    res.json({ success: true, message: 'Login successful!' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// --- Post message ---
app.post('/api/messages', async (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) return res.status(400).json({ success: false, error: 'Username & message required' });

  try {
    const newMsg = new Message({ username, message });
    await newMsg.save();
    console.log(`💌 New message from ${username}: ${message}`);
    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ success: false, error: 'Server error saving message' });
  }
});

// --- Get messages ---
app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: 1 }).limit(50);
    res.json(msgs);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ success: false, error: 'Server error fetching messages' });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
