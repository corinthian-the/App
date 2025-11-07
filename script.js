// === CONFIGURATION ===
const API_URL = "https://brendas-birthday.onrender.com"; // <-- replace with your Render backend link

// === ELEMENTS ===
const messageInput = document.getElementById("messageInput");
const addButton = document.getElementById("addMessageBtn");
const messageList = document.getElementById("messageList");
const surpriseBtn = document.getElementById("surpriseBtn");

// === ANIMATED GREETING ===
const greeting = document.getElementById("greeting");
let titleText = greeting.textContent;
greeting.textContent = "";
let i = 0;
function typeEffect() {
  if (i < titleText.length) {
    greeting.textContent += titleText.charAt(i);
    i++;
    setTimeout(typeEffect, 100);
  } else {
    greeting.classList.add("shine");
  }
}
window.addEventListener("load", typeEffect);

// === LOAD MESSAGES ===
async function loadMessages() {
  messageList.innerHTML = "<p class='loading'>Loading messages...</p>";
  try {
    const res = await fetch(`${API_URL}/messages`);
    const data = await res.json();

    if (data.length === 0) {
      messageList.innerHTML = "<p class='no-msg'>No messages yet. Be the first! 💌</p>";
    } else {
      messageList.innerHTML = "";
      data.forEach((msg) => {
        const card = document.createElement("div");
        card.className = "message-card";
        card.innerHTML = `
          <p>${msg.text}</p>
          <span>${new Date(msg.date).toLocaleString()}</span>
        `;
        messageList.appendChild(card);
      });
    }
  } catch (err) {
    messageList.innerHTML = "<p class='error'>Could not load messages 💔</p>";
    console.error(err);
  }
}

// === ADD NEW MESSAGE ===
async function addMessage() {
  const text = messageInput.value.trim();
  if (!text) return alert("Please write a message first 💕");

  await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  messageInput.value = "";
  loadMessages();
}

// === SURPRISE BUTTON ===
if (surpriseBtn) {
  surpriseBtn.addEventListener("click", () => {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
    alert("🎉 Surprise! Brenda, you’re loved more than words can say 💖");
  });
}

// === EVENT LISTENERS ===
addButton.addEventListener("click", addMessage);
window.addEventListener("load", loadMessages);
