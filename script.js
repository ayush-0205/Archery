const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const popup = document.getElementById("popup");

const target = {
  x: canvas.width - 150,
  y: canvas.height / 2,
  radius: 50
};

const bow = {
  x: 100,
  y: canvas.height / 2,
  radius: 40
};

let isAiming = false;
let aimX = bow.x;
let aimY = bow.y;
let arrows = [];

function drawTarget() {
  for (let i = 3; i >= 1; i--) {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * (i / 3), 0, Math.PI * 2);
    ctx.fillStyle = i === 1 ? "red" : (i === 2 ? "white" : "blue");
    ctx.fill();
  }
}

function drawBow() {
  ctx.beginPath();
  ctx.arc(bow.x, bow.y, bow.radius, Math.PI / 2, -Math.PI / 2);
  ctx.strokeStyle = "brown";
  ctx.lineWidth = 5;
  ctx.stroke();
}

function drawArrow(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(20, 0);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(15, -5);
  ctx.lineTo(15, 5);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.restore();
}

function showPopup(text) {
  popup.textContent = text;
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 1500);
}

function checkHit(x, y) {
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
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTarget();
  drawBow();

  arrows.forEach((arrow, index) => {
    arrow.x += arrow.vx;
    arrow.y += arrow.vy;
    arrow.vy += 0.1; // gravity

    drawArrow(arrow.x, arrow.y, arrow.angle);

    if (
      arrow.x > canvas.width ||
      arrow.y > canvas.height ||
      arrow.y < 0
    ) {
      arrows.splice(index, 1);
    }

    if (!arrow.hit && Math.abs(arrow.x - target.x) < target.radius && Math.abs(arrow.y - target.y) < target.radius) {
      checkHit(arrow.x, arrow.y);
      arrow.hit = true;
    }
  });

  if (isAiming) {
    ctx.beginPath();
    ctx.moveTo(bow.x, bow.y);
    ctx.lineTo(aimX, aimY);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  requestAnimationFrame(update);
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  aimX = e.clientX - rect.left;
  aimY = e.clientY - rect.top;
  isAiming = true;
});

canvas.addEventListener('mousemove', (e) => {
  if (isAiming) {
    const rect = canvas.getBoundingClientRect();
    aimX = e.clientX - rect.left;
    aimY = e.clientY - rect.top;
  }
});

canvas.addEventListener('mouseup', () => {
  if (isAiming) {
    const dx = aimX - bow.x;
    const dy = aimY - bow.y;
    const angle = Math.atan2(dy, dx);
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 5, 20);
    arrows.push({
      x: bow.x,
      y: bow.y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      angle: angle,
      hit: false
    });
    isAiming = false;
  }
});

update();
