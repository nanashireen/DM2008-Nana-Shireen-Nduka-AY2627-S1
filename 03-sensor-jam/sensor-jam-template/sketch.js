let port; // Serial Communication port
let connectBtn;
let wasOpened = false; // tracks port state to update the button label

let sensorVal;
let circleSize = 70;
let targetSize = 50; // used for Option 2

function setup() {
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port

  // Connection helpers
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background(100);
  
  // Draw the reactive circle
  fill(255, 150, 50);
  noStroke();
  ellipse(width / 2, height / 2, circleSize);

  updateConnectBtn();

  // Receive data from Arduino
  if (port.opened()) {
    sensorVal = port.readUntil("\n");
    
    // Check if we received actual data string
      
      if (sensorVal.length > 0) {
        // Optional: comment out console.log once debugging is done
        // console.log(sensorVal);

        // use float() to convert the data from string to number
        let val = float(sensorVal);

        // Ignore anything that isn't a number
        if (!isNaN(val)) {
          // OPTION 1:
          // Update circle's size with sensor's data directly
          // circleSize = val;

          // OPTION 2:
          // Map distance (5-100cm) to circle size: closer = bigger
          targetSize = map(val, 5, 100, 400, 50);
          // Smoothly interpolate towards the target size
          circleSize = lerp(circleSize, targetSize, 0.1);
        }
      }
    }
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