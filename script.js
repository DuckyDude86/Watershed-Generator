const canvas = document.getElementById("riverCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let streams = [];

class Stream {
    constructor(x, y) {
        this.points = [{ x, y }];
    }

    step() {
        const last = this.points[this.points.length - 1];

        // downward bias (THIS IS THE KEY FIX)
        const angle = (Math.random() - 0.5) * 1.2;

        const dx = Math.sin(angle) * 20;
        const dy = 12 + Math.random() * 10;

        const nx = last.x + dx;
        const ny = last.y + dy;

        this.points.push({ x: nx, y: ny });
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (const p of this.points) {
            ctx.lineTo(p.x, p.y);
        }

        ctx.strokeStyle = "rgba(120,120,255,0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function generate() {
    streams = [];

    const count = 25; // IMPORTANT: low number
    for (let i = 0; i < count; i++) {
        streams.push(new Stream(Math.random() * w, 0));
    }
}

function animate() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    for (const s of streams) {
        if (Math.random() < 0.8) s.step();
        s.draw();
    }

    requestAnimationFrame(animate);
}

document.getElementById("generateBtn").onclick = generate;

animate();
