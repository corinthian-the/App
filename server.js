// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

// ===== APP SETUP =====
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ===== MONGODB CONNECTION =====
const MONGO_URI = 'mongodb+srv://Brenda:18atlast@cluster0.l4i1nyh.mongodb.net/brendaAppDB?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

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
    const exists = await User.findOne({ username });
    if (exists) return res.json({ success: false, error: 'Username already exists' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });

    res.json({ success: true });
  } catch(err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, error: 'Invalid credentials' });

    res.json({ success: true });
  } catch(err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// --- Post message ---
app.post('/api/messages', async (req, res) => {
  try {
    const { username, message } = req.body;
    const newMsg = new Message({ username, message });
    await newMsg.save();
    res.json({ success: true });
  } catch(err) {
    console.error('Message error:', err);
    res.status(500).json({ success: false, error: 'Cannot save message' });
  }
});

// --- Get messages ---
app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(msgs);
  } catch(err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ success: false, error: 'Cannot fetch messages' });
  }
});

// ===== START SERVER =====
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
