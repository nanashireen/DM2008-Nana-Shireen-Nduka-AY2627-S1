// DM2008 — Activity 2b
// Pattern Making (40 min)
//
// Use a for loop to draw a repeating pattern of shapes.
// Add a condition to introduce variation, and one interaction that changes the rule.
//
// Stretch: try a second row, or turn your row into a 2D grid.
let startColour = 0;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

function draw() {
  background(240, 20);

  for (let x = 25; x < width; x += 50) {
    for (let y = 25; y < height; y += 50) {
      let d = dist(mouseX, mouseY, x, y);

      if (d < 60) {
        fill(255, 100, 100);
        ellipse(x, y, 15);
      } else if ((x + y) % 100 === 0) {
        fill(startColour + x);
        rect(x, y, 30, 30);
      } else {
        fill(startColour + y);
        ellipse(x, y, 30);
      }
    }
  }
}