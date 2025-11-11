// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";

app.use(cors());
app.use(express.json());

// file paths
const messagesFile = path.join(__dirname, "messages.json");
const usersFile = path.join(__dirname, "users.json");

// ensure files exist
if (!fs.existsSync(messagesFile)) fs.writeFileSync(messagesFile, JSON.stringify([]));
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));

// helpers: read/write JSON files
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Error reading", filePath, err);
    return [];
  }
}
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing", filePath, err);
  }
}

// === Auth helpers ===
function generateToken(payload) {
  // expires in 7 days
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// === Routes ===
app.get("/", (req, res) => res.send("💌 Brenda's Birthday API (auth + messages) running"));

// --- REGISTER ---
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: "Username and password required" });

  const users = readJSON(usersFile);
  const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) return res.status(400).json({ success: false, error: "Username already taken" });

  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  const newUser = { id: Date.now(), username, passwordHash: hash, createdAt: new Date().toISOString() };
  users.push(newUser);
  writeJSON(usersFile, users);

  const token = generateToken({ id: newUser.id, username: newUser.username });
  res.json({ success: true, token, user: { id: newUser.id, username: newUser.username } });
});

// --- LOGIN ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: "Username and password required" });

  const users = readJSON(usersFile);
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return res.status(400).json({ success: false, error: "Invalid credentials" });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(400).json({ success: false, error: "Invalid credentials" });

  const token = generateToken({ id: user.id, username: user.username });
  res.json({ success: true, token, user: { id: user.id, username: user.username } });
});

// --- GET current user ---
app.get("/me", authMiddleware, (req, res) => {
  res.json({ success: true, user: { id: req.user.id, username: req.user.username } });
});

// --- MESSAGES ---
// public: get messages
app.get("/messages", (req, res) => {
  const messages = readJSON(messagesFile);
  res.json(messages);
});

// protected: post message (requires auth)
app.post("/messages", authMiddleware, (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") return res.status(400).json({ success: false, error: "Message cannot be empty" });

  const messages = readJSON(messagesFile);
  const newMsg = {
    id: Date.now(),
    text: text.trim(),
    user: { id: req.user.id, username: req.user.username },
    timestamp: new Date().toISOString()
  };
  messages.push(newMsg);
  writeJSON(messagesFile, messages);

  res.json({ success: true, message: "Saved", data: newMsg });
});

// allow deleting messages by id (optional: only owner)
app.delete("/messages/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  let messages = readJSON(messagesFile);
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Message not found" });

  // only owner can delete
  if (messages[idx].user.id !== req.user.id) return res.status(403).json({ success: false, error: "Forbidden" });

  messages.splice(idx, 1);
  writeJSON(messagesFile, messages);
  res.json({ success: true, message: "Deleted" });
});

// start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // allows front-end to communicate with backend

// MongoDB connection
const uri = 'mongodb+srv://Brenda:18atlast@cluster0.l4i1nyh.mongodb.net/app?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Message schema
const messageSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// POST route to save messages
app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message({ message: req.body.message });
    const saved = await newMessage.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route to fetch messages (optional)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
