// === Animate the "Happy Birthday Brenda" text ===
const animatedTitle = document.getElementById("animatedTitle");
const titleText = "💖 Happy Birthday Brenda 💖";

let i = 0;
function typeTitle() {
  if (i < titleText.length) {
    animatedTitle.textContent += titleText.charAt(i);
    i++;
    setTimeout(typeTitle, 120);
  }
}
window.onload = typeTitle;

// === Brenda's Birthday App - Frontend Script ===

// 🌍 Backend API URL
const API_URL = "https://brendas-birthday.onrender.com/messages";

// === Select HTML Elements ===
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messageList = document.getElementById("messageList");

// === Load All Messages from Server ===
async function loadMessages() {
  try {
    const response = await fetch(API_URL);
    const messages = await response.json();

    // Clear the list first
    messageList.innerHTML = "";

    // Add each message to the list
    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.classList.add("message-item");
      li.textContent = msg;
      messageList.appendChild(li);
    });
  } catch (error) {
    console.error("⚠️ Error loading messages:", error);
    messageList.innerHTML = `<p style="color: #ff6b6b;">⚠️ Failed to load messages. Please try again later.</p>`;
  }
}

// === Send a New Message to the Server ===
async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return; // ignore empty messages

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();
    if (result.success) {
      messageInput.value = ""; // clear input
      await loadMessages(); // reload messages
    } else {
      alert("❌ Failed to send message.");
    }
  } catch (error) {
    console.error("⚠️ Error sending message:", error);
    alert("⚠️ Could not send your message. Try again later.");
  }
}

// === Event Listeners ===
sendBtn.addEventListener("click", sendMessage);
window.addEventListener("load", loadMessages);

// === Optional: Press Enter to Send ===
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
