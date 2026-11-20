// DM2008 — Activity 3a [Guided]
// Array Sampler (25 min)
//
// An array stores a list of values — here it's colors, but it could be
// sizes, positions, or anything else.
// Press any key to cycle through the array one item at a time.
//
// Try these:
// - Replace the colors with your own values (sizes, positions, text).
// - Use mousePressed() instead of keyPressed().
// - Use push() to add new items or splice() to remove them.
// - Loop through the whole array to draw all items at once.
//
// Stretch: visualize all items in the array simultaneously instead of one at a time.
let x = 200;
let y = 200;
let palette = ["#EF6CE4", "#F5A6EE", "#F8BFF3", "#FCE8FB"];
let randomnum = [50, 100, 200, 300];
let currentIndex = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(0);

  fill(palette[currentIndex]);
  ellipse(width / 2, height / 2, randomnum[currentIndex]);
}

function mousePressed() {
  currentIndex = floor(random(palette.length));
}

function keyPressed() {
  currentIndex++;

  if (currentIndex >= palette.length) {
    currentIndex = 0;
  }

  console.log("Current index:", currentIndex, "→", palette[currentIndex]);
}

