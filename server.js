// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./messages.json";

// Load messages from file when the server starts
let messages = [];
if (fs.existsSync(FILE_PATH)) {
  messages = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
}

// Get all messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// Add a new message and save to file
app.post("/messages", (req, res) => {
  const message = req.body.message;
  if (message) {
    const newMessage = { text: message, date: new Date().toISOString() };
    messages.push(newMessage);
    fs.writeFileSync(FILE_PATH, JSON.stringify(messages, null, 2));
  }
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
