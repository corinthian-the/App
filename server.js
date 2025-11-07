const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === File Path for Messages ===
const messagesFile = path.join(__dirname, "messages.json");

// === Ensure messages file exists ===
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([]));
}

// === Helper Functions ===
function readMessages() {
  try {
    const data = fs.readFileSync(messagesFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading messages:", err);
    return [];
  }
}

function writeMessages(messages) {
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error("Error writing messages:", err);
  }
}

// === Routes ===
app.get("/", (req, res) => {
  res.send("💌 Brenda's Birthday API is running!");
});

// Get all messages
app.get("/messages", (req, res) => {
  const messages = readMessages();
  res.json(messages);
});

// Post a new message
app.post("/messages", (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ success: false, error: "Message cannot be empty" });
  }

  const messages = readMessages();
  const newMessage = {
    text: message,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  writeMessages(messages);

  res.json({ success: true, message: "Message saved!" });
});

// === Start Server ===
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
