const canvas = document.getElementById("riverCanvas");
const ctx = canvas.getContext("2d");

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let nodes = [];
let branches = [];
let running = false;

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

class Node {
    constructor(x, y, mag = 1) {
        this.x = x;
        this.y = y;
        this.mag = mag;
    }
}

function clearAll() {
    nodes = [];
    branches = [];
    ctx.clearRect(0, 0, width, height);
}

function createHeadwaters(cap) {
    nodes = [];
    const spacing = width / cap;

    for (let i = 0; i < cap; i++) {
        nodes.push(
            new Node(
                i * spacing + Math.random() * 20,
                height - Math.random() * 80,
                1
            )
        );
    }
}

function mergeStep() {
    if (nodes.length <= 1) {
        running = false;
        return;
    }

    const spread = Number(document.getElementById("spread").value);

    const i = Math.floor(Math.random() * nodes.length);
    let j = Math.floor(Math.random() * nodes.length);
    while (j === i) j = Math.floor(Math.random() * nodes.length);

    const a = nodes[i];
    const b = nodes[j];

    nodes.splice(Math.max(i, j), 1);
    nodes.splice(Math.min(i, j), 1);

    const baseX = (a.x + b.x) / 2;

    const angle = (Math.random() - 0.5) * Math.PI;
    const dist = 25 + Math.random() * 40;

    const parent = new Node(
        baseX + Math.cos(angle) * spread,
        Math.min(a.y, b.y) - dist,
        a.mag + b.mag
    );

    branches.push({
        x1: a.x, y1: a.y,
        x2: parent.x, y2: parent.y,
        mag: parent.mag
    });

    branches.push({
        x1: b.x, y1: b.y,
        x2: parent.x, y2: parent.y,
        mag: parent.mag
    });

    nodes.push(parent);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    for (const b of branches) {
        ctx.strokeStyle = "rgb(120,120,255)";
        ctx.lineWidth = Math.log2(b.mag + 1) * 0.7;

        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        ctx.lineTo(b.x2, b.y2);
        ctx.stroke();
    }

    setText("branchCount", branches.length);
    setText("status", running ? "Running" : "Idle");

    if (nodes.length > 0) {
        const total = nodes.reduce((s, n) => s + n.mag, 0);
        setText("currentMagnitude", total);
        setText("outletMagnitude", nodes[nodes.length - 1]?.mag || 0);
    }
}

function loop() {
    if (running) {
        const speed = Number(document.getElementById("speed").value);
        for (let i = 0; i < speed; i++) mergeStep();
    }

    draw();
    requestAnimationFrame(loop);
}

function generate() {
    clearAll();

    const cap = Number(document.getElementById("cap").value);
    createHeadwaters(cap);

    running = true;
}

document.getElementById("generateBtn").onclick = generate;
document.getElementById("pauseBtn").onclick = () => running = !running;
document.getElementById("exportBtn").onclick = () => {
    const a = document.createElement("a");
    a.download = "river.png";
    a.href = canvas.toDataURL();
    a.click();
};

loop();
