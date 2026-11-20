// DM2008 — Activity 4a [Guided]
// Bake a Cookie (30 min)
//
// A class is a blueprint — Cookie describes what every cookie has and can do.
// Your job is to complete the class, then add movement and a flavor randomizer.
//
// Suggested order:
// 1. Add the missing properties to the constructor (sz, x, y)
// 2. Fix show() so it uses this.flavor, this.x, this.y, this.sz
// 3. Implement move() and randomFlavor()
// 4. Wire them up in keyPressed() and mousePressed()
//
// Stretch: add a second cookie with different starting values.

	
let cookie;
 
function setup() {
  createCanvas(400, 400);
  noStroke();
  // make one cookie object
  cookie = new Cookie("choc-chip", 170, width/2, height/2);
  for (let i = 0; i<100, i++;) {
    let x = random(width);
    let y = random(height);
    let sz = random(30,50);
    cookies.push
  }
}
 
function draw() {
  background(230);
  cookie.show();   // call the method on our object
}
 
// Class definition
class Cookie {
  constructor(flavor, sz, x, y) {
    this.flavor = flavor;
    this.sz = sz;
    this.x = x;
    this.y = y;
  }
  
  show() {	
    if (this.flavor == "choc-chip") {
      fill(196, 146, 96);
    } else {
      fill(220, 180, 120);
    }
    switch (this.flavor) {
      case "chocolate":
        fill(196, 146, 96);
        break;
      case "vanilla":
        fill(255, 223, 150);
        break;
      default:
        fill(220, 180, 120);
    }
    ellipse(this.x, this.y, this.sz);
 
    // a few "chips" placed relative to size
    const s = this.sz * 0.1;
    fill(60);
    ellipse(this.x - this.sz*0.22, this.y - this.sz*0.15, s);
    ellipse(this.x + this.sz*0.18, this.y - this.sz*0.10, s);
    ellipse(this.x - this.sz*0.05, this.y + this.sz*0.12, s);
    ellipse(this.x + this.sz*0.20, this.y + this.sz*0.18, s);
  }

  // Add a move() method — update this.x or this.y based on which key is pressed
  move() {
    this.x = this.x + 10
    this.y = this.y + 5
  }

  // Add a randomFlavor() method — set this.flavor to one of at least 3 options
  randomFlavor() {
    this.flavor = random(flavor);
  }
}

// Call cookie.move() when an arrow key is pressed
function keyPressed() {
  if (key == 'UP_ARROW') {
    
  }

}

// Call cookie.randomFlavor() when the mouse is clicked
function mousePressed() {

}