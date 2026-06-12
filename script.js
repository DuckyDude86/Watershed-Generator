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
// PARTICLE SYSTEM
// ----------------------
class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = 0;

    this.path = [{ x: this.x, y: this.y }];
  }

  step() {
    // CHAOS DIRECTION SET (biased downward but unstable)
    const dirs = [
      [0, 4],
      [-2, 4],
      [2, 4],
      [-5, 3],
      [5, 3],
      [0, 6]
    ];

    const last = this.path[this.path.length - 1];
    const choice = dirs[Math.floor(Math.random() * dirs.length)];

    // movement + jitter (chaos engine)
    this.x = last.x + choice[0] + (Math.random() - 0.5) * 3;
    this.y = last.y + choice[1];

    this.path.push({ x: this.x, y: this.y });

    // controlled memory (prevents meltdown)
    if (this.path.length > 1000) {
      this.path.shift();
    }
  }

  draw() {
    if (this.path.length < 2) return;

    // CHAOS COLOR ENGINE (changes every frame)
    const r = 80 + Math.random() * 175;
    const g = Math.random() * 140;
    const b = 120 + Math.random() * 135;

    ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
    ctx.lineWidth = 1 + Math.random() * 1.8;

    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);

    for (let i = 1; i < this.path.length; i++) {
      const p = this.path[i];
      ctx.lineTo(p.x, p.y);
    }

    ctx.stroke();
  }
}

// ----------------------
// SYSTEM SETUP
// ----------------------
let particles = [];

function generate() {
  particles = [];

  const count = 35; // balance between chaos and lag
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  document.getElementById("status").textContent = "CHAOS ACTIVE";
}

// ----------------------
// ANIMATION LOOP
// ----------------------
function animate() {
  // fade instead of full clear = trails persist
  ctx.fillStyle = "rgba(0,0,0,0.25)";
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
