const canvas = document.getElementById("riverCanvas");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let particles = [];
let terrain = [];
const grid = 10;

// ------------------------
// TERRAIN (fake heightmap)
// ------------------------
function generateTerrain() {
  terrain = [];

  for (let x = 0; x < w; x += grid) {
    const col = [];
    for (let y = 0; y < h; y += grid) {
      const v =
        Math.sin(x * 0.01) +
        Math.cos(y * 0.01) +
        Math.random() * 0.4;

      col.push(v);
    }
    terrain.push(col);
  }
}

function getHeight(x, y) {
  const gx = Math.floor(x / grid);
  const gy = Math.floor(y / grid);

  if (!terrain[gx] || terrain[gx][gy] === undefined) return 999;
  return terrain[gx][gy];
}

// ------------------------
// PARTICLES (water flow)
// ------------------------
class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = 0;
    this.path = [];
  }

  step() {
    const dirs = [
      [0, 4],
      [-3, 4],
      [3, 4],
      [-6, 3],
      [6, 3]
    ];

    let bestX = this.x;
    let bestY = this.y;
    let bestH = getHeight(this.x, this.y);

    for (const [dx, dy] of dirs) {
      const nx = this.x + dx;
      const ny = this.y + dy;

      const h = getHeight(nx, ny);

      if (h < bestH) {
        bestH = h;
        bestX = nx;
        bestY = ny;
      }
    }

    // small wobble so it doesn't become vertical ramen
    this.x = bestX + (Math.random() - 0.5) * 1.2;
    this.y = bestY;

    this.path.push({ x: this.x, y: this.y });

    // stop infinite growth
    if (this.path.length > 200) {
      this.path.shift();
    }
  }

  draw() {
    if (this.path.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);

    for (const p of this.path) {
      ctx.lineTo(p.x, p.y);
    }

    ctx.strokeStyle = "rgba(120,120,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ------------------------
// MAIN CONTROL
// ------------------------
function generate() {
  particles = [];
  generateTerrain();

  for (let i = 0; i < 40; i++) {
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

document.getElementById("generateBtn").onclick = generate;

animate();
