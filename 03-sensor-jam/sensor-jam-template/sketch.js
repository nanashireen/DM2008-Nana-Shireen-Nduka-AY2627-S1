let port; // Serial Communication port
let connectBtn;
let wasOpened = false; // tracks port state to update the button label

let sensorVal;
let squareSize = 100;
let targetSize = 50; // used for Option 2
let angle = 0; // current rotation angle in degrees
let spinSpeed = 1; // degrees per frame
let color1, color2, color3, color4, color5;
let currentColor;
let currentBgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port
  angleMode(DEGREES);
  rectMode(CENTER); // center square on (width / 2, height / 2)

  color1 = color(168, 204, 255);
  color2 = color(76, 125, 194);
  color3 = color(125, 76, 194);
  color4 = color(194, 76, 107);
  color5 = color(158, 25, 25);
  currentColor = color1;
  currentBgColor = color(100);

  // Connection helpers
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background(currentBgColor);
  updateConnectBtn();

  // Receive data from Arduino
  if (port.opened()) {
    sensorVal = port.readUntil("\n");

    // Check if we received actual data string
    if (sensorVal && sensorVal.length > 0) {
      let trimmed = sensorVal.trim();
      if (trimmed.length > 0) {
        // Optional: comment out console.log once debugging is done
        // console.log(sensorVal);

        // use float() to convert the data from string to number
        let val = float(trimmed);

        // Ignore anything that isn't a number
        if (!isNaN(val)) {
          // OPTION 1:
          // Update square's size with sensor's data directly
          // targetSize = val;

          // OPTION 2:
          // Map distance (5-100cm) to square size: closer = bigger
          targetSize = map(val, 5, 100, 400, 50);

          // Closer distance spins faster (adjust or set a fixed number like 2)
          spinSpeed = map(val, 5, 100, 8, 0.5);

          if (val < 20) {
            currentColor = color5;
            currentBgColor = color(168, 204, 255, 75);
          } else if (val < 40) {
            currentColor = color4;
            currentBgColor = color(76, 125, 194, 75);
          } else if (val < 60) {
            currentColor = color3;
            currentBgColor = color(183, 128, 255``, 75);
          } else if (val < 80) {
            currentColor = color2;
            currentBgColor = color(194, 76, 107, 75);
          } else {
            currentColor = color1;
            currentBgColor = color(158, 25, 25, 75);
          }
        }
      }
    }
  }

  // Smoothly interpolate towards the target size
  squareSize = lerp(squareSize, targetSize, 0.1);

  // Advance rotation angle
  angle += spinSpeed;

  // Draw the reactive square after updating fill color and rotation
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  fill(currentColor);
  noStroke();
  square(0, 0, squareSize);
  pop();
}

// DO NOT REMOVE THIS FUNCTION
function connectBtnClick() {
  if (!port.opened()) {
    port.open(9600); // opens port with Baud Rate of 9600
  } else {
    port.close();
  }
}

// Keeps the button in sync with the real port state
function updateConnectBtn() {
  let isOpened = port.opened();
  if (isOpened === wasOpened) return;
  wasOpened = isOpened;

  connectBtn.html(isOpened ? "Disconnect Arduino" : "Connect to Arduino");
  if (isOpened) {
    connectBtn.addClass("connected");
  } else {
    connectBtn.removeClass("connected");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}