let currentUser = null;
const authForms = document.getElementById('authForms');
const birthdayPage = document.getElementById('birthdayPage');
const authBtn = document.getElementById('authBtn');
const toggleLink = document.getElementById('toggleLink');
let loginMode = true;

// Toggle between login/signup forms
toggleLink.addEventListener('click', () => {
  loginMode = !loginMode;
  document.getElementById('formTitle').innerText = loginMode ? 'Login' : 'Sign Up';
  authBtn.innerText = loginMode ? 'Login' : 'Sign Up';
});

// Handle authentication
authBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) return;

  const res = await fetch(`/api/${loginMode ? 'login' : 'signup'}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });

  const data = await res.json();
  if (data.success) {
    currentUser = username;
    authForms.style.display = 'none';
    birthdayPage.style.display = 'block';
    loadMessages();
  } else {
    document.getElementById('authStatus').innerText = data.error;
  }
});

// Send a message
document.getElementById('sendBtn').addEventListener('click', async () => {
  const msgInput = document.getElementById('messageInput');
  const msg = msgInput.value.trim();
  if (!msg) return;

  await fetch('/api/messages', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: currentUser, message: msg})
  });

  msgInput.value = '';
  loadMessages();
});

// Load all messages
async function loadMessages() {
  const res = await fetch('/api/messages');
  const msgs = await res.json();
  const list = document.getElementById('messagesList');
  list.innerHTML = '';

  msgs.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.username}: ${m.message}`;
    list.appendChild(li);
  });
}
