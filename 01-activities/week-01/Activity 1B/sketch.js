// DM2008 — Activity 1b [Ryoji Ikeda]
// Learning By Making (30 min)

let x;
let w;
let palette = ['#ff007f', '#7f00ff', '#00ffff', '#ffaa00'];

function setup() {
  createCanvas(800, 800);
  background(255);
  noStroke();
  fill(0);
}

function draw() {
  background(255, 10);
  

  if (mouseIsPressed) {
    x = mouseX; 
    w = random(5, 25); 
    let selectedColour = random(palette);

    fill(selectedColour);
    
    if (mouseY < height / 2) {
      rect(x - w / 2, 0, w, height / 2);
    } 
    else {
      rect(x - w / 2, height / 2, w, height / 2);
    }
  }
  
}

function keyPressed() {
  saveCanvas("activity1b-image", "jpg");
}