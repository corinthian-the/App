// ------------------------------
// Function to send a message
// ------------------------------
async function sendMessage(msg) {
  if (!msg) return; // do nothing if empty

  try {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });

    const data = await response.json();
    console.log('✅ Message saved:', data);

    // Show status message
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Message saved!';
    statusEl.className = 'status success';
    setTimeout(() => (statusEl.textContent = ''), 2000);

    // Clear input
    const inputEl = document.getElementById('messageInput');
    inputEl.value = '';

    // Add message to the list
    addMessageToList(data.message);

  } catch (err) {
    console.error('❌ Error sending message:', err);
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Error saving message!';
    statusEl.className = 'status error';
    setTimeout(() => (statusEl.textContent = ''), 2000);
  }
}

// ------------------------------
// Function to fetch all messages
// ------------------------------
async function fetchMessages() {
  try {
    const response = await fetch('http://localhost:3000/api/messages');
    const messages = await response.json();

    // Clear existing list
    const listEl = document.getElementById('messagesList');
    listEl.innerHTML = '';

    // Add each message to the list
    messages.forEach(msg => addMessageToList(msg.message));

  } catch (err) {
    console.error('❌ Error fetching messages:', err);
  }
}

// ------------------------------
// Function to append message to the list
// ------------------------------
function addMessageToList(msg) {
  const listEl = document.getElementById('messagesList');
  const li = document.createElement('li');
  li.textContent = msg;
  listEl.appendChild(li);
}

// ------------------------------
// Event listeners
// ------------------------------
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', () => {
  const msg = document.getElementById('messageInput').value;
  sendMessage(msg);
});

// Optional: Send message on Enter key
const inputEl = document.getElementById('messageInput');
inputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const msg = inputEl.value;
    sendMessage(msg);
  }
});

// Surprise gift button
const giftBtn = document.getElementById('giftBtn');
giftBtn.addEventListener('click', () => {
  alert('🎁 Surprise! You got a special gift, Brenda!');
});

// ------------------------------
// Fetch messages on page load
// ------------------------------
window.addEventListener('DOMContentLoaded', fetchMessages);
