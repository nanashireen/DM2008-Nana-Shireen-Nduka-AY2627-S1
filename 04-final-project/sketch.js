const BAUD_RATE = 115200;
const TAP_THRESHOLD = 1000; // Max of sensor readings
const GROWTH_TIME = 2500;  // Time in milliseconds for a flowerto reach full size.

const rules = {
  X: [
    { rule: "F[+X]FX", prob: 0.4 },
    { rule: "F[-X]FX", prob: 0.4 },
    { rule: "F[+X][-X]FX", prob: 0.2 }
  ],
  F: [
    { rule: "FF", prob: 0.7 },
    { rule: "F", prob: 0.3 }
  ]
};

const len = 12;
const ang = 22;
const numGens = 3;
const rows = 50;
const cols = 100;

const flowerTypes = [
  { name: "Classic 5-Petal", pNum: 5, fD: 160, pLen: 60, pSharp: 0.5, fHeight: 250, curve1: 0.8, curve2: 0.2, b: 2.5, bNum: 10, hue: 345 },
  { name: "Star Blossom", pNum: 6, fD: 90, pLen: 130, pSharp: 1.4, fHeight: 220, curve1: 0.9, curve2: 0.15, b: 1.5, bNum: 12, hue: 45 },
  { name: "Ruffled Peony", pNum: 8, fD: 180, pLen: 45, pSharp: 0.3, fHeight: 280, curve1: 0.7, curve2: 0.25, b: 4.5, bNum: 16, hue: 315 },
  { name: "Wild Trillium", pNum: 3, fD: 110, pLen: 110, pSharp: 0.8, fHeight: 200, curve1: 1.0, curve2: 0.1, b: 2.0, bNum: 6, hue: 165 },
  { name: "Lotus Cup", pNum: 7, fD: 140, pLen: 80, pSharp: 0.6, fHeight: 310, curve1: 0.6, curve2: 0.3, b: 3.0, bNum: 14, hue: 20 },
  { name: "Dahlia Burst", pNum: 10, fD: 130, pLen: 95, pSharp: 0.9, fHeight: 230, curve1: 0.85, curve2: 0.2, b: 2.0, bNum: 20, hue: 265 }
];

let word = "";
let drawRules;
let flowerPoints = [];
let currentTypeIndex = 0;
let growthStartedAt = 0;

let connectButton;
let sensorStatus;
let wasAboveThreshold = false;

function setup() {
  connectButton = createButton("Connect pressure sensor");
  connectButton.mousePressed(connectSensor);

  const testButton = createButton("Test flower");
  testButton.mousePressed(startFlower);

  sensorStatus = createP("Test the flower or connect your Arduino.");

  const canvas = createCanvas(800, 800, WEBGL);
  canvas.class("canvas");

  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);
  noSmooth();

  // Flower Drawing Rules
  drawRules = {
    X: drawParticleFlower,

    F: () => {
      push();
      translate(0, -len / 2, 0);
      noStroke();
      fill(95, 45, 38);
      cylinder(1.4, len);
      pop();

      translate(0, -len, 0);
    },

    "+": () => rotateZ(-ang),
    "-": () => rotateZ(ang),
    "[": push,
    "]": pop
  };
}

function draw() {
  background(5);

  if (word === "") return;

  // Flower keeps growing even after the sensor reading drops
  const growth = constrain((millis() - growthStartedAt) / GROWTH_TIME, 0, 1);
  if (growth === 0) return;

  ambientLight(120);
  directionalLight(200, 200, 200, 0.5, 0.5, -1);
  orbitControl(2, 2);

  push();
  translate(0, height / 2, 0);
  scale(3 * growth);

  for (const symbol of word) {
    if (symbol in drawRules) {
      drawRules[symbol]();
    }
  }

  pop();
}

function startFlower() {
  if (word !== "") {
    currentTypeIndex = (currentTypeIndex + 1) % flowerTypes.length;
  }

  // Generate the branches once so they stay the same as the plant grows.
  word = "X";
  for (let i = 0; i < numGens; i++) {
    word = generate();
  }

  generateFlowerMesh(flowerTypes[currentTypeIndex]);
  growthStartedAt = millis();
}

function readSensorValue(value) {
  const finishedGrowing = millis() - growthStartedAt >= GROWTH_TIME;

  // Start a flower when the sensor reaches the threshold.
  if (value >= TAP_THRESHOLD && (word === "" || finishedGrowing)) {
    startFlower();
  }
}

async function connectSensor() {
  if (!navigator.serial) {
    sensorStatus.html("Open the sketch in desktop Chrome or Edge over HTTPS or localhost.");
    return;
  }

  let port;
  let reader;

  connectButton.attribute("disabled", "");

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: BAUD_RATE });
    reader = port.readable.getReader();

    const decoder = new TextDecoder();
    let buffer = "";

    sensorStatus.html("Connected. Tap the sensor to grow a flower.");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // Serial data can arrive halfway through a line.
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const reading = line.trim();
        if (reading === "") continue;

        const sensorValue = Number(reading);
        if (!Number.isFinite(sensorValue)) continue;

        readSensorValue(sensorValue);
        sensorStatus.html(`Sensor reading: ${sensorValue}`);
      }
    }

    sensorStatus.html("Sensor disconnected.");
  } catch (error) {
    sensorStatus.elt.textContent = `Serial connection: ${error.message}`;
  } finally {
    if (reader) reader.releaseLock();
    if (port?.readable) {
      await port.close().catch(() => {});
    }

    wasAboveThreshold = false;
    connectButton.removeAttribute("disabled");
  }
}

function generateFlowerMesh(params) {
  flowerPoints = [];

  const { pNum, fD, pLen, pSharp, fHeight, curve1, curve2, b, bNum } = params;

  for (let theta = 0; theta < rows; theta++) {
    const row = [];

    for (let phi = 0; phi < cols; phi++) {
      const angleDeg = phi * 360 / cols;
      const roseWave = pow(abs(sin((pNum / 2) * angleDeg)), pSharp);
      const r = (pLen * roseWave + fD) * (theta / rows);

      const n = noise(theta * 0.03, phi * 0.03);
      const scatter = (n - 0.5) * 4 * (theta / rows);

      const x = (r + scatter) * cos(angleDeg);
      const y = (r + scatter) * sin(angleDeg);
      const radius = r / 100;
      const z = fHeight * Math.exp(-curve2 * pow(radius, 1.5))
        * pow(radius, curve1) - 200
        + (1 + b * pow(radius, 2) * sin(bNum * angleDeg))
        + n * 3;

      const waveFactor = sin(pNum * angleDeg);
      const brightness = constrain(
        map(theta, 0, rows, 55, 98) + waveFactor * 8,
        45,
        100
      );

      row.push({ x, y, z, brightness });
    }

    flowerPoints.push(row);
  }
}

function drawParticleFlower() {
  push();
  scale(0.09);
  rotateX(55);
  translate(0, 0, 210);

  // Draw the dark petal surface behind the coloured points.
  noStroke();
  fill(0, 0, 5);

  for (let theta = 0; theta < rows - 1; theta++) {
    beginShape(TRIANGLE_STRIP);

    for (let phi = 0; phi <= cols; phi += 2) {
      const index = phi % cols;
      const pt1 = flowerPoints[theta][index];
      const pt2 = flowerPoints[theta + 1][index];

      vertex(pt1.x, pt1.y, pt1.z - 0.5);
      vertex(pt2.x, pt2.y, pt2.z - 0.5);
    }

    endShape();
  }

  const currentHue = flowerTypes[currentTypeIndex].hue;
  strokeWeight(2.1);

  for (const row of flowerPoints) {
    for (const pt of row) {
      stroke(currentHue, 35, pt.brightness);
      point(pt.x, pt.y, pt.z);
    }
  }

  pop();
}

function generate() {
  let next = "";

  for (const symbol of word) {
    if (symbol in rules) {
      next += chooseOne(rules[symbol]);
    } else {
      next += symbol;
    }
  }

  return next;
}

function chooseOne(ruleSet) {
  const choice = random();
  let total = 0;

  for (const option of ruleSet) {
    total += option.prob;
    if (choice < total) {
      return option.rule;
    }
  }

  return ruleSet[ruleSet.length - 1].rule;
}