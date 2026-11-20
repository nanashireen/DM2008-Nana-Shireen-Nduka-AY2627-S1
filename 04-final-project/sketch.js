const BAUD_RATE = 115200;

// Mapping the sensor readings and calibrating them (Sahara)
const TOUCH_THRESHOLD = 1;     // a reading at or above this starts a new flower growing
const RELEASE_THRESHOLD = 0;   // ONLY a reading at or below this ends the flower
const FULL_PRESSURE = 450;     // a reading this high grows the flower at top speed
const SENSOR_MAX = 1023;       // top of the meter bar
const SERIAL_TIMEOUT = 1000;   // ms of silence from the Arduino counts as released

// Sound effect that plays when a flower starts growing
const GROW_SOUND_FILE = "universfield-magic-spell-02-250240.mp3";   // has to be in the same folder as the sketch
const GROW_SOUND_VOLUME = 0.7;                                      // 0 is silent, 1 is full volume

// Figuring out the time and size of the flowers, and how many can be on screen at once (Nana)
const GROWTH_TIME = 1600;      // time to reach full size at normal pressure
const LIFE_TIME = 9000;        // how long a released flower stays perfect
const FADE_TIME = 7000;        // how long it then takes to fade and die
const MAX_FLOWERS = 12;        // oldest flowers fade early beyond this

// Adding the movement to the flowers (Nana)
const SWAY_SPEED = 0.0011;     // how fast the stems sway
const SWAY_AMOUNT = 0.7;       // degrees each stem piece leans (adds up toward the top)
const SPIN_SPEED = 0.007;      // degrees per millisecond that blossoms turn

// Initailising the flower parameters (Jocelyn)
const stemLength = 12;
const branchAngle = 22;
const generations = 3;
const rows = 16;
const cols = 40;
const BLOSSOM_PAD = 22;        

const rules = {
  X: [
    { text: "F[+X]FX", chance: 0.4 },
    { text: "F[-X]FX", chance: 0.4 },
    { text: "F[+X][-X]FX", chance: 0.2 }
  ],
  F: [
    { text: "FF", chance: 0.7 },
    { text: "F", chance: 0.3 }
  ]
};

// Starting recipes for the blossoms. Every new flower picks one at random and then nudges the numbers, so no two flowers are quite the same. (Jocelyn)
const species = [
  { name: "Pink blossom", hue: 345, petals: 5, base: 160, petal: 60, sharp: 0.5, tall: 250, curve: 0.8, falloff: 0.2, ripple: 2.5, waves: 10 },
  { name: "Gold star blossom", hue: 45, petals: 6, base: 90, petal: 130, sharp: 1.4, tall: 220, curve: 0.9, falloff: 0.15, ripple: 1.5, waves: 12 },
  { name: "Purple dahlia", hue: 265, petals: 10, base: 130, petal: 95, sharp: 0.9, tall: 230, curve: 0.85, falloff: 0.2, ripple: 2, waves: 20 }
];

const flowers = [];
let activeFlower = null;
let inputSource = null;
let lastReading = 0;
let lastReadingAt = 0;

let connectButton;
let testPressure;
let statusEl;
let meterFill;
let hintEl;
let growSound;

const GARDEN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&display=swap');
  html, body { margin: 0; background: #000; overflow: hidden; height: 100%; }
  canvas { display: block; position: fixed; inset: 0; }
  .panel {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    z-index: 10; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px 12px;
    padding: 12px 18px; border-radius: 18px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #e8e6ef; font-size: 13px; max-width: calc(100vw - 40px);
  }
  .title {
    font-family: "Cormorant Garamond", Georgia, serif; font-style: italic; font-weight: 500;
    font-size: 26px; line-height: 1; color: #f6ece4; margin-right: 6px;
  }
  .panel button, .panel select {
    font: inherit; color: #f2f0f8; cursor: pointer;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.18);
    border-radius: 10px; padding: 7px 12px; transition: background .15s, border-color .15s;
  }
  .panel button:hover, .panel select:hover { background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.35); }
  .panel button:active { background: rgba(243,182,204,0.35); }
  .panel button:disabled { opacity: .4; cursor: default; }
  .panel select option { background: #15131c; color: #f2f0f8; }
  .meter { width: 110px; height: 8px; border-radius: 6px; background: rgba(255,255,255,0.1); overflow: hidden; }
  .meter > div { height: 100%; width: 0%; border-radius: 6px;
    background: linear-gradient(90deg, #ff8fb3, #ffd36b, #a98bff); transition: width .08s linear; }
  .status { flex: 1 1 100%; text-align: center; font-size: 12px; color: #aaa6bb; }
  .hint {
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10;
    font-family: "Cormorant Garamond", Georgia, serif; font-style: italic;
    font-size: 17px; color: rgba(255,255,255,0.4);
    pointer-events: none; transition: opacity 1s;
  }
`;

// Adding UI and setting up the interface of the program (Nana) 

function setup() {
  pixelDensity(min(2, displayDensity()));
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);

  growSound = new Audio(GROW_SOUND_FILE);
  growSound.preload = "auto";

  buildInterface();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function buildInterface() {
  createElement("style", GARDEN_CSS);

  const panel = createDiv();
  panel.addClass("panel");

  createSpan("Pressure Garden").addClass("title").parent(panel);

  connectButton = createButton("Connect sensor");
  connectButton.parent(panel);
  connectButton.mousePressed(connectSensor);

  createSpan("Test").parent(panel);
  testPressure = createSelect();
  testPressure.parent(panel);
  testPressure.option("Light", "60");
  testPressure.option("Medium", "250");
  testPressure.option("Firm", "500");

  const testButton = createButton("Hold to grow");
  testButton.parent(panel);

  testButton.elt.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || activeFlower) return;
    testButton.elt.setPointerCapture(event.pointerId);
    beginPress(Number(testPressure.value()), "test");
  });

  testButton.elt.addEventListener("lostpointercapture", () => {
    if (inputSource === "test") finishPress();
  });

  const meter = createDiv();
  meter.addClass("meter");
  meter.parent(panel);
  meterFill = createDiv();
  meterFill.parent(meter);

  statusEl = createSpan("Connect the Arduino or hold the test button.");
  statusEl.addClass("status");
  statusEl.parent(panel);

  hintEl = createDiv("Press and hold to grow a flower. Let go completely to plant the next.");
  hintEl.addClass("hint");
}

function setMeter(value) {
  const pct = constrain(value / SENSOR_MAX, 0, 1) * 100;
  meterFill.elt.style.width = pct + "%";
}

// Main loop (Nana & Jocelyn and Sahara)
function draw() {
  const now = millis();
  const dt = min(deltaTime, 50);

  if (inputSource === "test") {
    const reading = Number(testPressure.value());
    growFlower(activeFlower, reading, dt);
    setMeter(reading);
  }

  if (inputSource === "sensor") {
    // The flower keeps growing every frame for as long as the reading is above 0.
    if (now - lastReadingAt > SERIAL_TIMEOUT) {
      finishPress();
    } else {
      growFlower(activeFlower, lastReading, dt);
    }
  }

  // Remove flowers that have fully faded so it seems like they are dying.
  for (let i = flowers.length - 1; i >= 0; i--) {
    if (fadeOf(flowers[i], now) >= 1) flowers.splice(i, 1);
  }

  background(0);

  ambientLight(120);
  directionalLight(200, 200, 200, 0.5, 0.5, -1);

  const bottomY = height / 2 - 12;

  for (const flower of flowers) {
    const fade = fadeOf(flower, now);
    const health = 1 - fade * 0.92;

    // Size the plant so a fully grown one fills up most of the screen
    const fit = min(
      flower.sizeFrac * height / flower.plantHeight,
      0.45 * width / flower.plantWidth
    );
    const grow = easeGrow(flower.growth);

    push();
    translate(flower.xFrac * width, bottomY, 0);
    scale(fit * grow * (1 - fade * 0.35));
    drawPlant(flower, health, fade, now);
    pop();
  }
}

function easeGrow(t) {
  return 1 - pow(1 - t, 2.2);
}

// Overshoots a little before settling, so blossoms pop open
function easeOutBack(t) {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);
}

// 0 while alive, rises to 1 as a released flower fades and dies
function fadeOf(flower, now) {
  if (flower.releasedAt === null) return 0;
  return constrain((now - flower.releasedAt - LIFE_TIME) / FADE_TIME, 0, 1);
}

// Pressing, growing and releasing (Nana & Sahara)

function pickX() {
  // Try a few spots and keep the one furthest from existing flowers.
  let best = 0;
  let bestDist = -1;

  for (let i = 0; i < 16; i++) {
    const x = random(-0.44, 0.44);
    let nearest = Infinity;
    for (const flower of flowers) {
      nearest = min(nearest, abs(flower.xFrac - x));
    }
    if (nearest > bestDist) {
      bestDist = nearest;
      best = x;
    }
  }

  return best;
}

// Plays a fresh copy of the sound each time, so quick presses don't cut the last one off
function playGrowSound() {
  if (!growSound) return;

  const sound = growSound.cloneNode();
  sound.volume = GROW_SOUND_VOLUME;
  sound.play().catch(() => {});
}

function beginPress(reading, source) {
  const now = millis();

  // Too many flowers: make the oldest released ones start fading early.
  const released = flowers
    .filter((flower) => flower !== activeFlower && flower.releasedAt !== null && fadeOf(flower, now) === 0)
    .sort((a, b) => a.releasedAt - b.releasedAt);

  let overflow = flowers.length + 1 - MAX_FLOWERS;
  for (let i = 0; i < released.length && overflow > 0; i++, overflow--) {
    released[i].releasedAt = now - LIFE_TIME;
  }

  const word = makePlantWord();
  const size = measurePlant(word);
  const type = makeRandomType();

  activeFlower = {
    word,
    blossoms: word.split("X").length - 1,
    xFrac: pickX(),
    plantHeight: size.h,
    plantWidth: size.w,
    sizeFrac: random(0.6, 0.8),
    seed: random(TWO_PI * 60),
    droopDir: random() < 0.5 ? -1 : 1,
    growth: 0.2,
    type,
    releasedAt: null
  };

  flowers.push(activeFlower);
  inputSource = source;
  playGrowSound();

  if (hintEl) hintEl.elt.style.opacity = "0";
}

function finishPress() {
  if (activeFlower) activeFlower.releasedAt = millis();
  activeFlower = null;
  inputSource = null;
  setMeter(0);
}

// Pressure only changes how fast the flower grows, not what kind it is.
function growFlower(flower, reading, elapsed) {
  if (!flower) return;

  // Stops at maximum size; the flower then stays until the sensor is released.
  if (flower.growth >= 1 || elapsed <= 0) return;

  const pressure = constrain(
    map(reading, TOUCH_THRESHOLD, FULL_PRESSURE, 0, 1),
    0,
    1
  );

  const speed = lerp(0.8, 1.4, pressure);
  flower.growth = min(1, flower.growth + elapsed * speed / GROWTH_TIME);
}
 
//Reading Sensor Values (Sahara)
function readSensorValue(reading) {
  const now = millis();

  if (inputSource === "sensor" && reading <= RELEASE_THRESHOLD) {
    // Reading is 0: this flower is finished, the next press plants a new one.
    finishPress();
  } else if (!activeFlower && reading >= TOUCH_THRESHOLD) {
    beginPress(reading, "sensor");
  }

  lastReading = reading;
  lastReadingAt = now;
  setMeter(reading);

  const current = inputSource === "sensor" && activeFlower ? ` | ${activeFlower.type.name}` : "";
  statusEl.elt.textContent = `Sensor reading: ${reading}${current}`;
}

async function connectSensor() {
  if (!navigator.serial) {
    statusEl.elt.textContent = "Open the sketch in desktop Chrome or Edge over HTTPS or localhost.";
    return;
  }

  let port;
  let reader;
  let opened = false;
  connectButton.elt.disabled = true;

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: BAUD_RATE });
    opened = true;
    reader = port.readable.getReader();

    const decoder = new TextDecoder();
    let buffer = "";
    statusEl.elt.textContent = "Connected. Press the sensor to plant a flower.";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const text = line.trim();
        const reading = Number(text);

        if (text !== "" && Number.isFinite(reading)) {
          readSensorValue(reading);
        }
      }
    }

    statusEl.elt.textContent = "Sensor disconnected.";
  } catch (error) {
    statusEl.elt.textContent = `Serial connection: ${error.message}`;
  } finally {
    if (inputSource === "sensor") finishPress();
    if (reader) reader.releaseLock();
    if (opened) await port.close().catch(() => {});
    connectButton.elt.disabled = false;
  }
}

// Creating the plants ( using L-system) and the blossoms ( using polar-coordinate 3D flower) (Jocelyn)

function makePlantWord() {
  let word = "X";

  for (let i = 0; i < generations; i++) {
    let next = "";

    for (const symbol of word) {
      next += rules[symbol] ? chooseRule(rules[symbol]) : symbol;
    }

    word = next;
  }

  return word;
}

function chooseRule(options) {
  const choice = random();
  let total = 0;

  for (const option of options) {
    total += option.chance;
    if (choice < total) return option.text;
  }

  return options[options.length - 1].text;
}

function measurePlant(word) {
  let x = 0;
  let y = 0;
  let a = 0;
  let minX = 0;
  let maxX = 0;
  let maxY = 0;
  const stack = [];

  for (const symbol of word) {
    if (symbol === "F") {
      x += sin(a) * stemLength;
      y += cos(a) * stemLength;
      minX = min(minX, x);
      maxX = max(maxX, x);
      maxY = max(maxY, y);
    } else if (symbol === "+") {
      a -= branchAngle;
    } else if (symbol === "-") {
      a += branchAngle;
    } else if (symbol === "[") {
      stack.push({ x, y, a });
    } else if (symbol === "]") {
      ({ x, y, a } = stack.pop());
    }
  }

  return {
    h: maxY + BLOSSOM_PAD,
    w: max(maxX - minX + BLOSSOM_PAD * 2, 40)
  };
}

function drawPlant(flower, health, fade, now) {
  let piece = 0;    
  let blossom = 0;  

  for (const symbol of flower.word) {
    switch (symbol) {
      case "X":
        drawBlossom(flower, blossom, health, now);
        blossom++;
        break;
      case "F": {
        // When the flower is dying every piece also bends over
        const wind = Math.sin(now * SWAY_SPEED + flower.seed + piece * 0.35) * SWAY_AMOUNT;
        rotateZ(wind + fade * flower.droopDir * 3);
        piece++;

        push();
        translate(0, -stemLength / 2, 0);
        noStroke();
        fill(110, 55 * health, 45 * health);
        cylinder(1.4, stemLength, 6, 1);
        pop();
        translate(0, -stemLength, 0);
        break;
      }
      case "+":
        rotateZ(-branchAngle);
        break;
      case "-":
        rotateZ(branchAngle);
        break;
      case "[":
        push();
        break;
      case "]":
        pop();
        break;
    }
  }
}

// Picks a blossom recipe at random and nudges the numbers a little so it is randomised
function makeRandomType() {
  const start = random(species);

  const type = {
    name: start.name,
    hue: start.hue + random(-14, 14),
    petals: max(4, start.petals + floor(random(-1, 2))),
    base: start.base * random(0.9, 1.1),
    petal: start.petal * random(0.85, 1.15),
    sharp: start.sharp * random(0.85, 1.2),
    tall: start.tall * random(0.92, 1.08),
    curve: start.curve,
    falloff: start.falloff,
    ripple: start.ripple * random(0.7, 1.3),
    waves: start.waves,
    noiseOffset: random(1000)
  };

  type.points = makeFlowerMesh(type);
  return type;
}

// Builds a grid of points: theta steps out from the centre, phi goes around (Jocelyn and Nana)
function makeFlowerMesh(type) {
  const points = [];

  for (let theta = 0; theta < rows; theta++) {
    const row = [];

    for (let phi = 0; phi < cols; phi++) {
      const angle = phi * 360 / cols;
      const wave = pow(abs(sin(type.petals * angle / 2)), type.sharp);
      const r = (type.petal * wave + type.base) * theta / rows;
      const n = noise(type.noiseOffset + theta * 0.03, type.noiseOffset + phi * 0.03);
      const scatter = (n - 0.5) * 4 * theta / rows;
      const radius = r / 100;

      const x = (r + scatter) * cos(angle);
      const y = (r + scatter) * sin(angle);
      const z = type.tall * Math.exp(-type.falloff * pow(radius, 1.5))
        * pow(radius, type.curve) - 199
        + type.ripple * pow(radius, 2) * sin(type.waves * angle) + n * 3;

      const brightness = constrain(
        map(theta, 0, rows, 55, 98) + sin(type.petals * angle) * 8,
        45,
        100
      );

      row.push({ x, y, z, brightness });
    }

    points.push(row);
  }

  return points;
}

//Drawing the blossoms (Jocelyn)
function drawBlossom(flower, number, health, now) {
  const type = flower.type;

  const start = 0.2 + 0.55 * (number / max(1, flower.blossoms - 1));
  const open = constrain((flower.growth - start) / 0.25, 0, 1);
  if (open <= 0.01) return;

  const direction = (number + floor(flower.seed)) % 2 === 0 ? 1 : -1;
  const spin = now * SPIN_SPEED * direction + number * 57 + flower.seed;
  const breathe = 1 + 0.03 * Math.sin(now * 0.002 + number * 1.7 + flower.seed);

  push();
  scale(0.09 * easeOutBack(open) * breathe);
  rotateX(55);
  rotateZ(spin);
  translate(0, 0, 210);

  noStroke();
  fill(0, 0, 3);

  for (let theta = 0; theta < rows - 1; theta++) {
    beginShape(TRIANGLE_STRIP);

    for (let phi = 0; phi <= cols; phi += 2) {
      const index = phi % cols;
      const first = type.points[theta][index];
      const second = type.points[theta + 1][index];

      vertex(first.x, first.y, first.z - 0.5);
      vertex(second.x, second.y, second.z - 0.5);
    }

    endShape();
  }

  strokeWeight(2.6);

  for (let theta = 0; theta < rows; theta += 2) {
    for (let phi = 0; phi < cols; phi += 2) {
      const pt = type.points[theta][phi];
      stroke(type.hue, 35 * health, lerp(3, pt.brightness, health));
      point(pt.x, pt.y, pt.z);
    }
  }

  pop();
}
