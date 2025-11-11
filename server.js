// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ===== APP SETUP =====
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ===== MONGODB CONNECTION =====
mongoose.connect('mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@cluster0.l4i1nyh.mongodb.net/brendaApp?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== SCHEMAS =====
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// ===== ROUTES =====

// --- Sign Up ---
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ success: false, error: 'Username already exists' });

    await User.create({ username, password });
    res.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Server error during signup' });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.json({ success: false, error: 'Invalid credentials' });

    res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// --- Post Message ---
app.post('/api/messages', async (req, res) => {
  try {
    const { username, message } = req.body;
    const newMsg = new Message({ username, message });
    await newMsg.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ success: false, error: 'Error saving message' });
  }
});

// --- Get Messages ---
app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(msgs);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ success: false, error: 'Error fetching messages' });
  }
});

// ===== START SERVER =====
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
