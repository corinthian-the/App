// === DOM Elements ===
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messages");
const giftButton = document.getElementById("giftButton");

const API_URL = "https://brendas-birthday.onrender.com"; // your live server URL

// === Load Messages ===
async function loadMessages() {
  try {
    const response = await fetch(`${API_URL}/messages`);
    if (!response.ok) throw new Error("Failed to load messages.");
    const messages = await response.json();

    messagesContainer.innerHTML = "";
    messages.forEach(msg => {
      const messageEl = document.createElement("div");
      messageEl.classList.add("message");
      messageEl.textContent = msg;
      messagesContainer.appendChild(messageEl);
    });
  } catch (err) {
    console.error(err);
    messagesContainer.innerHTML = `<p class="error">⚠️ Failed to load messages.</p>`;
  }
}

// === Send Message ===
async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();
    if (result.success) {
      messageInput.value = "";
      await loadMessages();
    } else {
      alert("❌ Failed to send message. Try again!");
    }
  } catch (err) {
    console.error("Error sending message:", err);
    alert("⚠️ Could not reach the server.");
  }
}

// === Event Listeners ===
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === Surprise Gift Feature ===
giftButton.addEventListener("click", () => {
  // --- Confetti Animation ---
  const confetti = document.createElement("div");
  confetti.classList.add("confetti");
  document.body.appendChild(confetti);

  for (let i = 0; i < 60; i++) {
    const spark = document.createElement("span");
    spark.classList.add("spark");
    spark.style.left = Math.random() * 100 + "vw";
    spark.style.animationDelay = Math.random() * 2 + "s";
    confetti.appendChild(spark);
  }

  setTimeout(() => confetti.remove(), 4000);

  // --- Surprise Message ---
  const surpriseMessage = document.createElement("div");
  surpriseMessage.classList.add("surprise-message");
  surpriseMessage.innerHTML = `
    <p>💞 Life has been better with you in it 💞</p>
    <div class="floating-hearts">
      <span>💖</span><span>💗</span><span>💞</span><span>💓</span><span>💘</span>
    </div>
  `;
  document.body.appendChild(surpriseMessage);

  // Optional: soft background tone (if you want)
  // const audio = new Audio("soft-melody.mp3");
  // audio.volume = 0.4;
  // audio.play();

  setTimeout(() => surpriseMessage.remove(), 8000);
});

// === Initialize ===
loadMessages();
