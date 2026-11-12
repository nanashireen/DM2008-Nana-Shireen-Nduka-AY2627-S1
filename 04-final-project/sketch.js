let port; // do not remove or rename port
let serialData;

function setup() {
  // Change this if you want a fixed size canvas
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port
}

function draw() {
  background(240);

  // Receive data from Arduino
  if (port.opened()) {
    serialData = port.readUntil("\n");
    // Only log and use data that has information, not empty signals
    if (serialData[0]) {
      // Remember to convert the serial data from string to number using float()
      // Disable or remove console.log once verified working
      console.log(serialData);
    }
  }
}

// DO NOT REMOVE THIS FUNCTION
function connectBtnClicked() {
  // When button is clicked, check if serial port is already opened
  if (!port.opened()) {
    // If not already, open the port with baud rate 9600
    // Make sure baud rate here matches settings in Arduino
    port.open(9600);
  } else {
    // Otherwise, close the port
    port.close();
  }
}
