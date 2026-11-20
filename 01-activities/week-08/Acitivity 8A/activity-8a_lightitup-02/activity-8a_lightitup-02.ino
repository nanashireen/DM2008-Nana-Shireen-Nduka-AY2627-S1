// DM2008 — Activity 8a
// Type 3: Fade Control (10 min)

int ledPin = 9;     // must be a PWM pin (~)
int brightness = 0; // current brightness level (0–255)
int fadeAmount = 5; // how much brightness changes each step

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  analogWrite(ledPin, brightness);

  brightness += fadeAmount;

  // When brightness hits 0 or 255, reverse the direction
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }

  delay(30);
}