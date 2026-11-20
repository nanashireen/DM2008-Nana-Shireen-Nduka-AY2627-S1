// DM2008 — Activity 3b
// One Function Wonder (30 min)
//
// Write a function that draws a shape or group of shapes.
// It should take at least one parameter — try x, y, size, or color.
// Call it several times with different values to create variation.
//
// Ideas: a simple face, a flower, a house, an icon.
// Example: myShape(100, 200, 50); myShape(300, 200, 80);
//
// Stretch: call your function inside a for loop to create a repeating pattern.

let isDark = false;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(isDark ? 0 : 255);

  // Call your function here with different values each time
  myShape(100, 100, 140);
  myShape(300, 200, 160);
  myShape(100, 300, 140);
  myShape(300, 0, 120);
  myShape(300, 400, 120);
  myShape(0, 200, 120);
}

function mousePressed() {
  isDark = !isDark;
}

// Define your function outside draw()
// It can be called from anywhere in your sketch

function myShape(x, y, s) {
  push();
  translate(x, y);
  rotate(frameCount * 0.01);

  let shade = isDark ? 255 : 0;
  fill(shade);
  stroke(shade);

  let rays = 24;
  let rayLength = s / 2;

  for (let i = 0; i < rays; i++) {
    let dotDistance = i % 2 === 0 ? rayLength : rayLength * 0.65;

    line(0, 0, rayLength, 0);
    ellipse(dotDistance, 0, s * 0.08, s * 0.08);

    rotate(TWO_PI / rays);
  }

  ellipse(0, 0, s * 0.25, s * 0.25);
  pop();
}