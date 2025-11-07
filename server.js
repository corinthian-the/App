const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === File path for message storage ===
const messagesFile = path.join(__dirname, "messages.json");

// === Load existing messages (if file exists) ===
let messages = [];
if (fs.existsSync(messagesFile)) {
  const data = fs.readFileSync(messagesFile, "utf8");
  try {
    messages = JSON.parse(data);
  } catch (err) {
    console.error("Error parsing messages.json:", err);
    messages = [];
  }
}

// === API ROUTES ===

// Get all messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// Add a new message
app.post("/messages", (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ success: false, error: "Message cannot be empty" });
  }

  const newMsg = {
    text: message,
    date: new Date().toISOString()
  };

  messages.push(newMsg);

  // Save messages to file
  fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
    if (err) console.error("Error saving messages:", err);
  });

  res.json({ success: true, message: "Message saved successfully!" });
});

// Default route
app.get("/", (req, res) => {
  res.send("💌 Brenda's Birthday API is running!");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
