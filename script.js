const surpriseDiv = document.getElementById("surprise");
const randomMessage = document.getElementById("randomMessage");
const revealBtn = document.getElementById("revealBtn");
const form = document.getElementById("messageForm");
const newMessageInput = document.getElementById("newMessage");

revealBtn.addEventListener("click", async () => {
  surpriseDiv.classList.remove("hidden");
  const res = await fetch("http://localhost:3000/messages");
  const messages = await res.json();
  const random = messages[Math.floor(Math.random() * messages.length)];
  randomMessage.textContent = random.text;
  startConfetti();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newMsg = newMessageInput.value.trim();
  if (!newMsg) return;
  await fetch("http://localhost:3000/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newMsg })
  });
  newMessageInput.value = "";
  alert("Message added for Brenda 💖");
});

function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const confetti = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random() * 0.5 + 0.5
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    confetti.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    update();
  }

  function update() {
    confetti.forEach(p => {
      p.y += p.d * 5;
      if (p.y > canvas.height) p.y = 0;
    });
  }

  setInterval(draw, 30);
}
