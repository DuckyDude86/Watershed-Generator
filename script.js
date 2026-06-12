const canvas = document.getElementById("riverCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let running = false;

let nodes = [];
let branches = [];

let outletMagnitude = 0;
let currentMagnitude = 0;

class Node {
    constructor(x, y, magnitude = 1) {
        this.x = x;
        this.y = y;
        this.magnitude = magnitude;
    }
}

function updateStats() {
    document.getElementById("currentMagnitude").textContent =
        currentMagnitude;

    document.getElementById("outletMagnitude").textContent =
        outletMagnitude;

    document.getElementById("branchCount").textContent =
        branches.length;

    document.getElementById("strahlerOrder").textContent =
        estimateStrahler(outletMagnitude);

    document.getElementById("status").textContent =
        running ? "Generating" : "Stopped";
}

function estimateStrahler(mag) {

    if (mag < 1) return 0;

    return Math.floor(Math.log2(mag)) + 1;
}

function clearSimulation() {

    nodes = [];
    branches = [];

    outletMagnitude = 0;
    currentMagnitude = 0;

    ctx.clearRect(0, 0, width, height);

    updateStats();
}

function createHeadwaters(cap) {

    nodes = [];

    const spacing = width / cap;

    for (let i = 0; i < cap; i++) {

        const x =
            i * spacing +
            Math.random() * spacing * 0.8;

        const y =
            height -
            40 -
            Math.random() * 150;

        nodes.push(new Node(x, y, 1));
    }

    currentMagnitude = cap;
}

function mergeStep() {

    if (nodes.length <= 1) {

        outletMagnitude =
            nodes.length === 1
                ? nodes[0].magnitude
                : 0;

        running = false;
        return;
    }

    const spread =
        Number(document.getElementById("spread").value);

    nodes.sort((a, b) => a.y - b.y);

    const idx =
        Math.floor(Math.random() * (nodes.length - 1));

    const a = nodes[idx];
    const b = nodes[idx + 1];

    nodes.splice(idx, 2);

    const nx =
        (a.x + b.x) / 2 +
        (Math.random() - 0.5) * spread;

    const ny =
        Math.min(a.y, b.y) -
        (10 + Math.random() * 25);

    const magnitude =
        a.magnitude + b.magnitude;

    const parent =
        new Node(nx, ny, magnitude);

    branches.push({
        x1: a.x,
        y1: a.y,
        x2: parent.x,
        y2: parent.y,
        magnitude: magnitude
    });

    branches.push({
        x1: b.x,
        y1: b.y,
        x2: parent.x,
        y2: parent.y,
        magnitude: magnitude
    });

    nodes.push(parent);

    outletMagnitude = magnitude;
}

function draw() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    for (const branch of branches) {

        const lineWidth =
            Math.max(
                1,
                Math.log2(branch.magnitude + 1) * 0.8
            );

        const brightness =
            Math.min(
                255,
                100 +
                Math.log2(branch.magnitude + 1) * 20
            );

        ctx.strokeStyle =
            `rgb(${brightness},${brightness},255)`;

        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(branch.x1, branch.y1);
        ctx.lineTo(branch.x2, branch.y2);
        ctx.stroke();
    }

    updateStats();
}

function animate() {

    if (running) {

        const speed =
            Number(
                document.getElementById("speed").value
            );

        for (let i = 0; i < speed; i++) {
            mergeStep();
        }
    }

    draw();

    requestAnimationFrame(animate);
}

function generate() {

    clearSimulation();

    const cap =
        Number(
            document.getElementById("cap").value
        );

    createHeadwaters(cap);

    running = true;
}

document
    .getElementById("generateBtn")
    .addEventListener("click", generate);

document
    .getElementById("pauseBtn")
    .addEventListener("click", () => {

        running = !running;

        document.getElementById("pauseBtn")
            .textContent =
            running ? "Pause" : "Resume";
    });

document
    .getElementById("exportBtn")
    .addEventListener("click", () => {

        const link =
            document.createElement("a");

        link.download =
            "watershed.png";

        link.href =
            canvas.toDataURL();

        link.click();
    });

animate();