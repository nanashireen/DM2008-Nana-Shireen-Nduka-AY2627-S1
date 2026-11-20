// DM2008 — Activity 5a [Guided]
// Colliding Circles (30 min)
//
// A vector stores position and movement together — cleaner than separate x and y variables.
// Your job is to get two balls moving, then detect and respond to their collision.
//
// Suggested order:
// 1. Create two Ball objects in setup()
// 2. Check the distance between them in draw()
// 3. Trigger a visual response when they collide
// 4. Implement edge behaviour in move() — wrap or bounce, your choice
//
// Stretch: add a third ball, or make the collision response affect both balls.

let balls = [];

function setup() {
  createCanvas(400, 400);
  // Create two balls at different starting positions
  balls.push(new Ball(100, 200, 2, 0.8));
  balls.push(new Ball(300, 200, -2, 0.8));
}

function draw() {
  background(230);

  for (let ball of balls) {
    ball.move();
  }

  // Check collision between the two balls
  // dist() measures the distance between their centers
  // They overlap when that distance is less than the sum of their radii

  let d = dist(balls[0].pos.x, balls[0].pos.y, balls[1].pos.x, balls[1].pos.y);
  let colliding = d < balls[0].r + balls[1].r; // true when the balls overlap, false otherwise

  for (let ball of balls) {
    ball.show(colliding);
  }
}

class Ball {
  constructor(x, y, speedX, speedY) {
    // pos and vel are vectors — they store x and y together as one object
    this.pos = createVector(x, y);
    this.vel = createVector(speedX, speedY);
    this.r = 30;
  }

  move() {
    // Adding the velocity vector to position moves the ball each frame
    this.pos.add(this.vel);

    // Handle edges — could you make this bounce instead of wrap?
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    }

    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }
  }

  show(colliding) {
    // colliding is true or false — try using it in an if/else to change fill or size
    if (colliding) {
      fill(240, 120, 100);
    } else {
      fill(100, 180, 220);
    }

    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}