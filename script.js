const canvas = document.getElementById("riverCanvas");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

// ----------------------
// PARTICLES
// ----------------------
class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = 0;
    this.path = [{ x: this.x, y: this.y }]; // IMPORTANT: never empty
  }

  step() {
    const dirs = [
      [0, 4],
      [-2, 4],
      [2, 4],
      [-4, 3],
      [4, 3]
    ];

    const last = this.path[this.path.length - 1];

    let bestX = last.x;
    let bestY = last.y;

    // biased downward movement
    const choice = dirs[Math.floor(Math.random() * dirs.length)];

    bestX = last.x + choice[0];
    bestY = last.y + choice[1];

    this.x = bestX + (Math.random() - 0.5) * 1.5;
    this.y = bestY;

    this.path.push({ x: this.x, y: this.y });

    // prevent infinite memory growth
    if (this.path.length > 200) {
      this.path.shift();
    }
  }

  draw() {
    if (this.path.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);

    for (let i = 1; i < this.path.length; i++) {
      const p = this.path[i];
      if (!p) continue;
      ctx.lineTo(p.x, p.y);
    }

    ctx.strokeStyle = "rgba(120,120,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ----------------------
// SYSTEM
// ----------------------
let particles = [];

function generate() {
  particles = [];

  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }

  document.getElementById("status").textContent = "Running";
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  for (const p of particles) {
    p.step();
    p.draw();
  }

  requestAnimationFrame(animate);
}

// ----------------------
// EVENTS
// ----------------------
document.getElementById("generateBtn").onclick = generate;

animate();
