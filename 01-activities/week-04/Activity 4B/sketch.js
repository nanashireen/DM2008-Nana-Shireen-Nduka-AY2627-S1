// DM2008 — Activity 4b [Guided]
// Objects in Motion (50 min)
//
// You have a working Agent class to start with — your job is to bring it to life.
// Each agent moves, changes over time, and is drawn to the screen.
// Mouse click adds a new agent. C clears them all.
//
// Things to try:
// - Change the starting values (size, speed, color) to see what happens
// - Make agents bounce instead of wrap — what needs to change?
// - Add a second method to your class beyond update() and show()
//
// Stretch: give each agent a lifespan — shrink or fade it over time, then remove it.
// Hint: a backward loop lets you safely splice items while iterating.

let agents = [];
const NUM_START = 12;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  for (let i = 0; i < NUM_START; i++) {
    let sz = random(15, 40);
    let x = random(sz / 2, width - sz / 2);
    let y = random(sz / 2, height - sz / 2);
    let speedX = random(-4, 4);
    let speedY = random(-4, 4);
    agents.push(new Agent(x, y, sz, speedX, speedY));
  }
}

function draw() {
  background(230, 20, 15, 0.25);

  for (let i = agents.length - 1; i >= 0; i--) {
    let agent = agents[i];
    agent.shrink();

    if (agent.sz <= 2) {
      agents.splice(i, 1);
    } else {
      agent.update();
      agent.show();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < 5; i++) {
    let sz = random(25, 50);
    let speedX = random(-5, 5);
    let speedY = random(-5, 5);
    agents.push(new Agent(mouseX, mouseY, sz, speedX, speedY));
  }
}

function keyPressed() {
  // Replacing the array with an empty one effectively clears all agents
  if (key == "C" || key == "c") {
    agents = [];
  }
}

class Agent {
  constructor(x, y, sz, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.sz = sz;
    this.startSize = sz;
    this.dx = speedX;
    this.dy = speedY;
    this.col = random(180, 300);
    this.pulseAngle = random(TWO_PI);
  }

  shrink() {
    this.sz -= 0.12;
  }

  update() {
    // Position changes by speed each frame — can you see why?
    this.x += this.dx;
    this.y += this.dy;

    // This is a property changing over time — try changing size or speed instead
    this.col = (this.col + 1.5) % 360;
    this.pulseAngle += 0.08;

    let radius = this.sz / 2;

    if (this.x > width - radius) {
      this.dx = -abs(this.dx);
    } else if (this.x < radius) {
      this.dx = abs(this.dx);
    }

    if (this.y > height - radius) {
      this.dy = -abs(this.dy);
    } else if (this.y < radius) {
      this.dy = abs(this.dy);
    }

    this.x = constrain(this.x, radius, width - radius);
    this.y = constrain(this.y, radius, height - radius);
  }

  show() {
    // this.col drives the color shift — how could you use your other properties here?
    push();
    translate(this.x, this.y);

    let fade = (this.sz - 2) / (this.startSize - 2);
    let pulse = sin(this.pulseAngle) * 8;
    fill(this.col, 80, 100, 0.2 * fade);
    ellipse(0, 0, this.sz + pulse + 12);

    fill(this.col, 85, 95, 0.85 * fade);
    ellipse(0, 0, this.sz);

    fill((this.col + 180) % 360, 20, 100, 0.9 * fade);
    ellipse(0, 0, this.sz * 0.35);

    stroke(this.col, 90, 100, 0.6 * fade);
    strokeWeight(2);
    line(0, 0, this.dx * 4, this.dy * 4);

    pop();
  }
}