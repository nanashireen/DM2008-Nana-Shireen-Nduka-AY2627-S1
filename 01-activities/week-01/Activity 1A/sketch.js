// DM2008 — Activity 1a
// Simple Creatures (20 min)

// Run the sketch, then click on the preview to enable keyboard
// Use the 'Option' ('Alt' on Windows) key to view or hide the grid
// Use the 'Shift' key to change overlays between black & white
// Write the code for your creature within the space provided

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(148, 184, 232);
  // YOUR CODE HERE
  // YOUR CODE HERE
  strokeWeight(1)
  fill("#FFE8E8")
  stroke("#FFE8E8");
  ellipse(180, 150, 30, 150);
  ellipse(220, 150, 30, 150);
  fill("#FFC0CB")
  ellipse(180, 150, 20, 120);
  ellipse(220, 150, 20, 120);
  fill("#FFE8E8")
  stroke("#FFE8E8");
  ellipse(200, 200, 105, 85);
  stroke("#FFE8E8")
  fill("#FFC0CB")
  ellipse(170, 203, 22, 16)
  ellipse(229, 203, 22, 16)
  fill("#000");
  ellipse(180, 190, 20, 20);
  ellipse(220, 190, 20, 20);
  fill("#FFFFFF")
  ellipse(223, 186, 8, 8);
  ellipse(183, 186, 8, 8);
  fill("#FFFFFF")
  ellipse(217, 192, 4, 4);
  ellipse(177, 192, 4, 4);
  fill("#FFC0CB")
  ellipse(200, 205, 15, 10)
  stroke("#FFC0CB")
  rect(199,207,2,7)
  noFill()
  strokeWeight(3)
  arc(194, 208, 15, 15, QUARTER_PI, HALF_PI+QUARTER_PI);
  arc(205, 208, 15, 15, QUARTER_PI, HALF_PI+QUARTER_PI);
  fill("#3F70B0")
  stroke("#3F70B0")
  rect(0,225,400,180)
  stroke("#FFE8E8")
  fill("#FFE8E8")
  ellipse(155, 228, 30, 20)
  ellipse(245, 228, 30, 20)
  stroke("#FFC0CB")
  line(145, 235, 148, 231)
  line(155, 238, 158, 234)
  line(245, 238, 242, 234)
  line(255, 235, 252, 231)
  
  helperGrid(); // do not edit or remove this line
}
