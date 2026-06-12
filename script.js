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
// PARTICLES WITH TRAILS
// ----------------------
class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = 0;
    this.path = [{ x: this.x, y: this.y }];
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
    const choice = dirs[Math.floor(Math.random() * dirs.length)];

    this.x = last.x + choice[0] + (Math.random() - 0.5) * 1.2;
    this.y = last.y + choice[1];

    this.path.push({ x: this.x, y: this.y });

    // IMPORTANT CHANGE:
    // keep full trails longer, only trim very lightly
    if (this.path.length > 1200) {
      this.path.shift();
    }
  }

  draw() {
    if (this.path.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);

    for (let i = 1; i < this.path.length; i++) {
      const p = this.path[i];
      ctx.lineTo(p.x, p.y);
    }

    ctx.strokeStyle = "rgba(120,120,255,0.55)";
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

  for (let i = 0; i < 30; i++) {
    particles.push(new Particle());
  }

  document.getElementById("status").textContent = "Running";
}

// ----------------------
// ANIMATION LOOP
// ----------------------
function animate() {
  // IMPORTANT: semi-transparent fade instead of full clear
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, w, h);

  for (const p of particles) {
    p.step();
    p.draw();
  }

  requestAnimationFrame(animate);
}

// ----------------------
document.getElementById("generateBtn").onclick = generate;

animate();
