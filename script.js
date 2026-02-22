/* ─── Sparkle Cursor ──────────────────────────── */
const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];
let mouse = { x: -999, y: -999 };

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  // spawn a burst of sparkles
  for (let i = 0; i < 4; i++) spawnParticle(mouse.x, mouse.y);
});

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const COLORS = [
  '#ff6fd8', '#ff9a3c', '#fff700', '#00f7ff',
  '#7fff00', '#ff3cac', '#784ba0', '#2b86c5'
];

function spawnParticle(x, y) {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(1.5, 5);
  particles.push({
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(3, 8),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 1,
    decay: randomBetween(0.018, 0.035),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.15, 0.15),
    shape: Math.random() > 0.5 ? 'star' : 'circle'
  });
}

function drawStar(ctx, x, y, r, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerX = Math.cos((i * 4 * Math.PI) / 5 - Math.PI / 2) * r;
    const outerY = Math.sin((i * 4 * Math.PI) / 5 - Math.PI / 2) * r;
    const innerX = Math.cos(((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2) * (r * 0.4);
    const innerY = Math.sin(((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2) * (r * 0.4);
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.alpha > 0);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08; // gravity
    p.alpha -= p.decay;
    p.rotation += p.rotationSpeed;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;

    if (p.shape === 'star') {
      drawStar(ctx, p.x, p.y, p.radius, p.rotation);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  requestAnimationFrame(animate);
}
animate();

/* ─── Floating Background Emojis ─────────────── */
const EMOJIS = ['😂', '💀', '🔥', '😭', '🤣', '💸', '🤡', '😤', '👀', '✨', '💅', '🙏'];
const container = document.getElementById('bgEmojis');

function spawnBgEmoji() {
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'bg-emoji-item';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.bottom = '-60px';
  el.style.fontSize = randomBetween(1.5, 3.5) + 'rem';
  const duration = randomBetween(6, 14);
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = '0s';
  container.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000);
}

// Initial burst
for (let i = 0; i < 15; i++) {
  setTimeout(spawnBgEmoji, i * 400);
}
// Keep spawning
setInterval(spawnBgEmoji, 900);

/* ─── Click Burst ─────────────────────────────── */
window.addEventListener('click', e => {
  for (let i = 0; i < 20; i++) spawnParticle(e.clientX, e.clientY);
});

// Fade in on load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
