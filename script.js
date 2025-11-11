// Function to send a message to the backend
async function sendMessage(msg) {
  if (!msg) return; // do nothing if empty

  try {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',                  // sending data
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }) // message to save
    });

    const data = await response.json();
    console.log('✅ Message saved:', data);

    // Optionally, show confirmation on page
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = 'Message saved!';
      statusEl.className = 'status success';
      setTimeout(() => (statusEl.textContent = ''), 2000);
    }

    // Clear the input field
    const inputEl = document.getElementById('messageInput');
    if (inputEl) inputEl.value = '';

  } catch (err) {
    console.error('❌ Error sending message:', err);
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = 'Error saving message!';
      statusEl.className = 'status error';
      setTimeout(() => (statusEl.textContent = ''), 2000);
    }
  }
}

// Attach to your send button
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const msg = document.getElementById('messageInput').value;
    sendMessage(msg);
  });
}

// Optional: Send message on Enter key
const inputEl = document.getElementById('messageInput');
if (inputEl) {
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const msg = inputEl.value;
      sendMessage(msg);
    }
  });
}
