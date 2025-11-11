// === CONFIG ===
const API_URL = "https://brendas-birthday.onrender.com/messages";

// === DOM ELEMENTS ===
const signupBox = document.getElementById("signupBox");
const loginBox = document.getElementById("loginBox");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const appSection = document.getElementById("appSection");
const authMsg = document.getElementById("authMsg");
const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const errorMsg = document.getElementById("errorMsg");

// === AUTH LOGIC ===
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

function showApp() {
  document.querySelector(".auth-section").style.display = "none";
  appSection.style.display = "block";
}

function showAuth() {
  document.querySelector(".auth-section").style.display = "block";
  appSection.style.display = "none";
}

if (currentUser) {
  showApp();
  loadMessages();
}

// Signup
signupBtn.addEventListener("click", () => {
  const name = document.getElementById("signupName").value.trim();
  const pass = document.getElementById("signupPassword").value.trim();

  if (!name || !pass) {
    authMsg.textContent = "Please enter all fields.";
    return;
  }

  if (users[name]) {
    authMsg.textContent = "User already exists. Try logging in.";
    return;
  }

  users[name] = pass;
  localStorage.setItem("users", JSON.stringify(users));
  authMsg.textContent = "Signup successful! You can log in now 💖";
});

// Login
loginBtn.addEventListener("click", () => {
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  if (!users[name] || users[name] !== pass) {
    authMsg.textContent = "Invalid credentials 😢";
    return;
  }

  localStorage.setItem("currentUser", name);
  currentUser = name;
  showApp();
  loadMessages();
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  currentUser = null;
  showAuth();
});

// === MESSAGE LOGIC ===
async function loadMessages() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    messagesContainer.innerHTML = "";
    data.forEach((msg) => {
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = msg;
      messagesContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load messages:", err);
    errorMsg.textContent = "⚠️ Failed to load messages.";
  }
}

sendBtn.addEventListener("click", async () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `${currentUser}: ${msg}` }),
    });

    const data = await res.json();
    if (data.success) {
      messageInput.value = "";
      loadMessages();
      errorMsg.textContent = "";
    } else {
      errorMsg.textContent = "⚠️ Failed to send message.";
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "⚠️ Failed to send message.";
  }
});

// === SURPRISE GIFT MODAL ===
const giftBtn = document.getElementById("giftBtn");
const modal = document.getElementById("giftModal");
const closeGift = document.getElementById("closeGift");

if (giftBtn && modal && closeGift) {
  giftBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeGift.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}
