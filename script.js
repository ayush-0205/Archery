const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const popup = document.getElementById("popup");

const target = {
  x: canvas.width - 150,
  y: canvas.height / 2,
  radius: 50
};

function drawTarget() {
  for (let i = 3; i >= 1; i--) {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * (i / 3), 0, Math.PI * 2);
    ctx.fillStyle = i === 1 ? "red" : (i === 2 ? "white" : "blue");
    ctx.fill();
  }
}

function drawArrow(x, y) {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = "brown";
  ctx.fill();
}

function showPopup(text) {
  popup.textContent = text;
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 1500);
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTarget();
  drawArrow(x, y);

  const dx = x - target.x;
  const dy = y - target.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > target.radius) {
    showPopup("Miss You </3");
  } else if (distance > target.radius / 3) {
    showPopup("Hit !!!");
  } else {
    showPopup("I love you ❤");
  }
});

drawTarget();
