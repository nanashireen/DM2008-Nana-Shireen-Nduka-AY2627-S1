// DM2008 — Activity 2a
// Mode Switch (20 min)
//
// Use keys 1, 2, 3 to switch between at least 3 modes.
// Each mode should change more than just the background — think fill, size, or motion.
//
// Stretch: add a 4th mode, or make the ellipse change shape between modes.

let x = 0;       // ellipse x-position
let size = 50;   // ellipse size
let bgColor;     // background color, changed by key presses
let shapeColor;
let colours = ["#B03F3F", "#B0793F", "#B0A13F"];
let isRect = false;
let colorIndex = 0;

function setup() {
  createCanvas(400, 400);
  bgColor = color(220);
  shapeColor = color(colours[0]);
  rectMode(CENTER);
}

function draw() {
  background(bgColor);

  if (frameCount % 60 === 0) {
    colorIndex = (colorIndex + 1) % colours.length;
    shapeColor = color(colours[colorIndex]);
  }

  fill(shapeColor);

  if (isRect) {
    rect(x, height / 2, size, size);
  } else {
    ellipse(x, height / 2, size);
  }

  x += 2;

  if (x > width + size / 2) {
    x = -size / 2;
  }
}

// Keys 1, 2, 3 change the background color
function keyPressed() {
  switch (key) {
    case "1":
      bgColor = color(200, 100, 100);
      isRect = false;
      colorIndex = (colorIndex + 1) % colours.length;
      shapeColor = color(colours[colorIndex]);
      break; // red
    case "2":
      bgColor = color(100, 200, 100);
      isRect = true;
      break; // green
    case "3":
      bgColor = color(100, 100, 200);
      size += 20;
      break; // blue
    default:
      bgColor = color(220); // grey
  }
}
