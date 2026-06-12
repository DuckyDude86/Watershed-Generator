const canvas = document.getElementById("riverCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// height field
const gridSize = 6;
let terrain = [];

function generateTerrain() {
    terrain = [];

    for (let x = 0; x < w; x += gridSize) {
        let col = [];
        for (let y = 0; y < h; y += gridSize) {
            // smooth noise-like field
            const v = Math.sin(x * 0.01) + Math.cos(y * 0.01) + Math.random() * 0.3;
            col.push(v);
        }
        terrain.push(col);
    }
}

function getHeight(x, y) {
    const gx = Math.floor(x / gridSize);
    const gy = Math.floor(y / gridSize);

    if (!terrain[gx] || terrain[gx][gy] === undefined) return 999;

    return terrain[gx][gy];
}

// water particle
class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = 0;
        this.path = [];
    }

    step() {
        let bestX = this.x;
        let bestY = this.y;
        let bestH = getHeight(this.x, this.y);

        // check neighbors (downhill search)
        const dirs = [
            [0, 4],
            [-3, 4],
            [3, 4],
            [0, -2]
        ];

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

        this.x = bestX;
        this.y = bestY;

        this.path.push({ x: this.x, y: this.y });
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);

        for (const p of this.path) {
            ctx.lineTo(p.x, p.y);
        }

        ctx.strokeStyle = "rgba(120,120,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

let particles = [];

function generate() {
    generateTerrain();
    particles = [];

    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
        if (Math.random() < 0.9) p.step();
        p.draw();
    }

    requestAnimationFrame(animate);
}

document.getElementById("generateBtn").onclick = generate;

animate();
