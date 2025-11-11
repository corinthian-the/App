// script.js - Auth + Messages frontend

const API_BASE = "https://brendas-birthday.onrender.com"; // backend base

// AUTH elements
const regUsername = document.getElementById("regUsername");
const regPassword = document.getElementById("regPassword");
const registerBtn = document.getElementById("registerBtn");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const authMsg = document.getElementById("authMsg");

const authArea = document.getElementById("authArea");
const appArea = document.getElementById("appArea");
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");

// APP elements
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const giftButton = document.getElementById("giftButton");
const errorBox = document.getElementById("error");

// token helpers
function saveToken(token) { localStorage.setItem("brenda_token", token); }
function getToken() { return localStorage.getItem("brenda_token"); }
function clearToken(){ localStorage.removeItem("brenda_token"); }

function authHeader() {
  const t = getToken();
  return t ? { Authorization: "Bearer " + t, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// --- AUTH actions ---
registerBtn.addEventListener("click", async () => {
  const username = regUsername.value.trim();
  const password = regPassword.value.trim();
  if (!username || !password) { authMsg.textContent = "Please fill username + password"; return; }

  try {
    const res = await fetch(API_BASE + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      saveToken(data.token);
      showAppForUser(data.user.username);
    } else {
      authMsg.textContent = data.error || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    authMsg.textContent = "Network error";
  }
});

loginBtn.addEventListener("click", async () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();
  if (!username || !password) { authMsg.textContent = "Please fill username + password"; return; }

  try {
    const res = await fetch(API_BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      saveToken(data.token);
      showAppForUser(data.user.username);
    } else {
      authMsg.textContent = data.error || "Login failed";
    }
  } catch (err) {
    console.error(err);
    authMsg.textContent = "Network error";
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  appArea.style.display = "none";
  authArea.style.display = "block";
  authMsg.textContent = "Logged out";
});

// --- Show app area ---
function showAppForUser(username) {
  authArea.style.display = "none";
  appArea.style.display = "block";
  welcomeUser.textContent = `Welcome, ${username}`;
  loadMessages();
}

// --- check if already logged in on load ---
async function checkSession() {
  const token = getToken();
  if (!token) return; // stay at auth area
  try {
    const res = await fetch(API_BASE + "/me", { headers: { Authorization: "Bearer " + token }});
    const data = await res.json();
    if (data && data.success) {
      showAppForUser(data.user.username);
    } else {
      clearToken();
    }
  } catch (err) {
    console.error("Session check failed", err);
    clearToken();
  }
}

// --- MESSAGES ---
async function loadMessages() {
  try {
    const res = await fetch(API_BASE + "/messages");
    const msgs = await res.json();
    messagesContainer.innerHTML = "";
    msgs.reverse().forEach(m => {
      const el = document.createElement("div");
      el.className = "message";
      el.innerHTML = `<strong>${escapeHtml(m.user.username)}</strong> <small>${new Date(m.timestamp).toLocaleString()}</small><p>${escapeHtml(m.text)}</p>`;
      messagesContainer.appendChild(el);
    });
  } catch (err) {
    console.error("Load messages error", err);
    messagesContainer.innerHTML = `<p class="error">⚠️ Failed to load messages.</p>`;
  }
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  try {
    const res = await fetch(API_BASE + "/messages", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.success) {
      messageInput.value = "";
      loadMessages();
    } else {
      alert(data.error || "Failed to send");
    }
  } catch (err) {
    console.error("Send message error", err);
    alert("Network error sending message");
  }
}

// basic XSS-safe text
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
  })[s]);
}

// events
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// --- Surprise Gift feature (keeps same behavior) ---
giftButton.addEventListener("click", () => {
  // confetti
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

  // message
  const surpriseMessage = document.createElement("div");
  surpriseMessage.classList.add("surprise-message");
  surpriseMessage.innerHTML = `
    <p>💞 Life has been better with you in it 💞</p>
    <div class="floating-hearts">
      <span>💖</span><span>💗</span><span>💞</span><span>💓</span><span>💘</span>
    </div>
  `;
  document.body.appendChild(surpriseMessage);
  setTimeout(() => surpriseMessage.remove(), 8000);
});

// initialize
checkSession();
