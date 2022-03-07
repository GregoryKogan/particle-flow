const cellWidth = 100
const force = 0.5
const noiseFactor = 0.4
const noiseStep = 0.1
const particleCount = 1500;
const friction = 0.9
let noiseZ = 0
let cells = []
let particles = []


function updateFlow() {
    noiseZ += noiseStep

    cells = []
    for (let i = 0; i * cellWidth < window.innerHeight; ++i) {
        let cellLine = []
        for (let j = 0; j * cellWidth < window.innerWidth; ++j) {
            const noiseVal = noise(i * noiseFactor, j * noiseFactor, noiseZ) * Math.PI * 2;
            const angle = p5.Vector.fromAngle(noiseVal, force)
            cellLine.push(angle);
        }
        cells.push(cellLine)
    }
}


function setup() {
    frameRate(30)
    noiseSeed(Math.random() * 100);
    noiseDetail(2, 0.2);
    updateFlow()
    for (let i = 0; i < particleCount; ++i) {
        let pos = createVector(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
        let vel = createVector(0, 0)
        let particle = { pos: pos, vel: vel, mass: Math.random() * 1 + 0.5 }
        particles.push(particle);
    }
    createCanvas(window.innerWidth, window.innerHeight)
}

function draw() {
    if (frameCount % 12 == 0) updateFlow()
    for (let i = 0; i < particleCount; ++i) {
        if (particles[i].pos.x < 0) particles[i].pos.x += window.innerWidth
        if (particles[i].pos.x > window.innerWidth) particles[i].pos.x -= window.innerWidth
        if (particles[i].pos.y < 0) particles[i].pos.y += window.innerHeight
        if (particles[i].pos.y > window.innerHeight) particles[i].pos.y -= window.innerHeight

        const cellI = Math.floor(particles[i].pos.y / cellWidth)
        const cellJ = Math.floor(particles[i].pos.x / cellWidth)
        const acceleration = cells[cellI][cellJ].copy()
        acceleration.mult(1 / particles[i].mass)
        particles[i].vel.add(acceleration)
        particles[i].vel.mult(friction)
        particles[i].pos.add(particles[i].vel)
    }

    background("#1a1b2608")
    fill("#1a1b26")
    noStroke()
    rect(5, window.innerHeight - 35, 40, 20)
    fill("#fff")
    text(Math.round(frameRate()) + "FPS", 7, window.innerHeight - 20);
    stroke("#2ac3deaa")
    strokeWeight(2);
    fill("#2ac3deaa")
    for (let i = 0; i < particleCount; ++i) {
        line(
            particles[i].pos.x - particles[i].vel.x, 
            particles[i].pos.y - particles[i].vel.y,
            particles[i].pos.x, 
            particles[i].pos.y
        )
    }

    for (let i = 0; i < cells.length; ++i) {
        for (let j = 0; j < cells[i].length; ++j) {
            noFill()
            stroke("#ffffff")
            line(
                j * cellWidth + cellWidth / 2, 
                i * cellWidth + cellWidth / 2, 
                j * cellWidth + cellWidth / 2 + cells[i][j].x * 50, 
                i * cellWidth + cellWidth / 2 + cells[i][j].y * 50
            )
        }
    }
}