// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)
//
// Complete this scaffold into a playable game.
// Your game should have player control, collision detection,
// score tracking, and at least two game states.
//
// Not sure where to start? Try this order:
// 1. Get the bird flapping — add control in keyPressed()
// 2. Get pipes spawning — uncomment the spawn logic in draw()
// 3. Add collision detection between the bird and pipes
// 4. Add scoring when the bird passes a pipe
// 5. Add game states — at minimum a playing state and a game over state
//
// Stretch: add a start screen, a high score, or a difficulty curve.

/* ----------------- Globals ----------------- */

let bird;
let pipes = [];
let score = 0;
let spawnCounter = 0;
let fontsize = 20;
let bg;
let subImg;
let seaweedImg;

const SPAWN_RATE = 90;
const PIPE_SPEED = 3.5;
const PIPE_GAP = 180;
const PIPE_W = 60;

// Game states: "start", "playing", or "gameover"
let gameState = "start";

/* ----------------- Setup & Draw ----------------- */
function preload() {
  bg = loadImage('background.jpg');
  subImg = loadImage('pixelsub-1.png');
  seaweedImg = loadImage('pixelseaweed.png'); //I tired the function async method but it kept making my pillars and player spawn strangely and in multiples
}

function setup() {
  createCanvas(480, 640);
  noStroke();
  imageMode(CORNER);
  //Adding font from google
  let fontLink = createElement('link');
  fontLink.attribute('rel', 'stylesheet');
  fontLink.attribute('href', 'https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
  textFont('Tiny5');
  
  resetGame();
}

function resetGame() {
  bird = new Bird(120, height / 2);
  pipes = [];
  pipes.push(new Pipe(width + 40));
  score = 0;
  spawnCounter = 0;
}

function draw() {
  if (bg) {
    image(bg, 0, 0, width, height);
  } else {
    background(112, 197, 206);
  }

  if (gameState === "start") {
    bird.show(true);
    push();
    fill(0, 150);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(34);
    text("FLAPPY BIRD: UNDERWATER", width / 2, height / 2 - 30);
    textSize(20);
    text("Press SPACE or UP ARROW to Start", width / 2, height / 2 + 30);
    pop();
  } else if (gameState === "playing") {
    bird.update();

    //Increases Difficulty
    let currentSpawnRate = max(50, SPAWN_RATE - (score * 2));

    // Spawn a new pipe every SPAWN_RATE frames, then reset the counter
    spawnCounter++;
    if (spawnCounter >= currentSpawnRate) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // When the bird hits a pipe, trigger game over
      if (pipes[i].hits(bird)) {
        // What should happen when the game ends?
        gameState = "gameover";
      }

      // When the bird passes a pipe, increment the score
      // Hint: use pipes[i].passed to make sure you only score once per pipe
      if (!pipes[i].passed && pipes[i].x + pipes[i].w < bird.pos.x) {
        // increment score here
        pipes[i].passed = true;
        score += 1;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    // Check ground collision
    if (bird.pos.y >= height - bird.r) {
      gameState = "gameover";
    }

    bird.show();
    push();
    fill(255);
    textSize(fontsize);
    text('score: ' + score, 30, 30);
    stroke(255);
    noFill();
    rect(25, 12, 100, 25);
    pop();
    // Display the score — look up textAlign() and textSize() in the p5.js reference
  } else if (gameState === "gameover") {
    // What should the player see when the game ends?
    // How do they restart?
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }
    bird.show();

    push();
    fill(0, 150);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("GAME OVER", width / 2, height / 2 - 30);
    textSize(20);
    text("Final Score: " + score, width / 2, height / 2 + 10);
    text("Press SPACE to Restart", width / 2, height / 2 + 50);
    pop();
  }
}

/* ----------------- Input ----------------- */
function keyPressed() {
  // Make the bird flap on space or UP_ARROW — call bird.flap()
  if (gameState === "start") {
    if (key === ' ' || keyCode === UP_ARROW) {
      gameState = "playing";
      bird.flap();
    }
  } else if (gameState === "playing") {
    if (key === ' ' || keyCode === UP_ARROW) {
      bird.flap();
    }
  } else if (gameState === "gameover") {
    if (key === ' ' || keyCode === UP_ARROW) {
      resetGame();
      gameState = "playing";
    }
  }
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 10;
    this.gravity = 0.45;
    this.flapStrength = -8.0;
    this.trail = [];
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // A negative y velocity moves the bird upward
    this.vel.y = this.flapStrength;
  }

  update() {
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Keep the bird within the canvas vertically
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }

    // Touching the ground is game over — same as hitting a pipe
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
    }

    //Adding trail of bubbles
    this.trail.push(createVector(this.pos.x - 20, this.pos.y));
    if (this.trail.length > 12) {
      this.trail.shift(); // Remove the oldest bubble position
    }
  }

  show(isIdle = false) {
    let yPos = this.pos.y;
    if (isIdle) {
      yPos += sin(frameCount * 0.08) * 6;
    }

    for (let i = 0; i < this.trail.length; i++) {
      let bubble = this.trail[i];
      let size = map(i, 0, this.trail.length, 3, 10);
      let alpha = map(i, 0, this.trail.length, 30, 180);
      fill(255, 255, 255, alpha);
      noStroke();
      circle(bubble.x, bubble.y, size);
    }

    if (subImg) {
      imageMode(CENTER);
      image(subImg, this.pos.x, yPos, 65, 60);
      imageMode(CORNER);
    } else {
      fill(255, 205, 80);
      circle(this.pos.x, yPos, this.r * 2);
      fill(40);
      circle(this.pos.x + 6, yPos - 4, 4);
    }
  }
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;

    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);
    this.top = gapY;
    this.bottom = gapY + PIPE_GAP;

    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    if (seaweedImg) {
      push();
      translate(this.x + this.w / 2, this.top / 2);
      scale(1, -1);
      imageMode(CENTER);
      image(seaweedImg, 0, 0, this.w, this.top);
      pop();

      push();
      translate(this.x + this.w / 2, this.bottom + (height - this.bottom) / 2);
      imageMode(CENTER);
      image(seaweedImg, 0, 0, this.w, height - this.bottom);
      pop();
      imageMode(CORNER);
    } else {
      fill(120, 200, 160);
      rect(this.x, 0, this.w, this.top);
      rect(this.x, this.bottom, this.w, height - this.bottom);
    }
  }

  offscreen() {
    // 'return' sends a value back to wherever this method was called
    // We'll cover this properly next week, for now just know it gives back true or false
    return this.x + this.w < 0;
  }

  // Checks if the bird overlaps with either pipe rectangle
  // 1) Is the bird within the pipe's x range?
  // 2) If yes, is it outside the gap — above the top or below the bottom?
  hits(bird) {
    // This method also uses 'return' — coming up next week!
    const withinX = (bird.pos.x + bird.r > this.x + 6) && (bird.pos.x - bird.r < this.x + this.w - 6);
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}