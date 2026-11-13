// L-System Rules
let rules = {
  X: [
    { rule: "F[+X]FX",       prob: 0.4 },
    { rule: "F[-X]FX",       prob: 0.4 },
    { rule: "F[+X][-X]FX",   prob: 0.2 }
  ],
  F: [
    { rule: "FF",   prob: 0.7 },
    { rule: "F",    prob: 0.3 },
  ]
};

const len = 12;
const ang = 22;
const numGens = 3;

let drawRules;
let word = "X";

// Optimized Flower Mesh Parameters
let rows = 50, cols = 100; 
let flowerPoints = [];

// Polar Rose Flower Species Presets (Inspired by your 2D sketch formula)
let flowerTypes = [
  { name: "Classic 5-Petal", pNum: 5, fD: 160, pLen: 60,  pSharp: 0.5, fHeight: 250, curve1: 0.8, curve2: 0.2, b: 2.5, bNum: 10 },
  { name: "Star Blossom",    pNum: 6, fD: 90,  pLen: 130, pSharp: 1.4, fHeight: 220, curve1: 0.9, curve2: 0.15, b: 1.5, bNum: 12 },
  { name: "Ruffled Peony",   pNum: 8, fD: 180, pLen: 45,  pSharp: 0.3, fHeight: 280, curve1: 0.7, curve2: 0.25, b: 4.5, bNum: 16 },
  { name: "Wild Trillium",   pNum: 3, fD: 110, pLen: 110, pSharp: 0.8, fHeight: 200, curve1: 1.0, curve2: 0.1, b: 2.0, bNum: 6 },
  { name: "Lotus Cup",       pNum: 7, fD: 140, pLen: 80,  pSharp: 0.6, fHeight: 310, curve1: 0.6, curve2: 0.3, b: 3.0, bNum: 14 },
  { name: "Dahlia Burst",    pNum: 10, fD: 130, pLen: 95, pSharp: 0.9, fHeight: 230, curve1: 0.85, curve2: 0.2, b: 2.0, bNum: 20 }
];
let currentTypeIndex = 0;

function setup() {
  let canvas = createCanvas(800, 800, WEBGL);
  canvas.class("canvas");

  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);
  noSmooth();

  // Generate initial flower geometry
  generateFlowerMesh(flowerTypes[currentTypeIndex]);

  drawRules = {
    "X": () => {
      drawParticleFlower();
    },
    "F": () => {
      // Draw 3D volumetric cylinder branch
      push();
      colorMode(HSB, 360, 100, 100);
      translate(0, -len / 2, 0);
      noStroke();
      fill(95, 45, 38); // Natural muted green stem
      cylinder(1.4, len);
      pop();
      
      translate(0, -len, 0);
    },
    "+": () => {
      rotateZ(-ang);
    },
    "-": () => {
      rotateZ(ang);
    },
    "[": push,
    "]": pop,
  };

  noLoop();
}

function draw() {
  background(5); // Pure dark background
  
  // Neutral lighting
  ambientLight(120);
  directionalLight(200, 200, 200, 0.5, 0.5, -1);

  orbitControl(2, 2);

  // Generate L-System string
  word = "X";
  for(let i = 0; i < numGens; i++) {
    word = generate();
  }

  // Render L-System in 3D WEBGL space
  push();
  translate(0, height / 2, 0); // Anchored exactly at the bottom edge of the canvas
  scale(3.0);
  
  for(let i = 0; i < word.length; i++) {
    let c = word[i];
    if(c in drawRules) {
      drawRules[c]();
    }  
  }
  pop();
}

function generateFlowerMesh(params) {
  flowerPoints = []; // Clear previous flower geometry

  let pNum = params.pNum;
  let fD = params.fD;
  let pLen = params.pLen;
  let pSharp = params.pSharp;
  let fHeight = params.fHeight;
  let curve1 = params.curve1;
  let curve2 = params.curve2;
  let b = params.b;
  let bNum = params.bNum;

  for (let theta = 0; theta < rows; theta += 1) {
    let rowArr = [];
    let thetaVal = theta;
    for (let phi = 0; phi < cols; phi += 1) {
      let angleDeg = phi * 360 / cols;
      
      let roseWave = pow(abs(sin((pNum / 2) * angleDeg)), pSharp);
      let r = (pLen * roseWave + fD) * (thetaVal / rows);
      
      let n = noise(thetaVal * 0.03, phi * 0.03);
      let scatter = (n - 0.5) * 4 * (thetaVal / rows);
      
      let x = (r + scatter) * cos(angleDeg);
      let y = (r + scatter) * sin(angleDeg);
      let z = fHeight * pow(Math.E, -curve2 * pow(abs(r/100), 1.5)) * pow(abs(r/100), curve1) - 200 +
        (1 + b * pow(r/100, 2) * sin(bNum * angleDeg)) + (n * 3);

      let waveFactor = sin(pNum * angleDeg);
      let brightVal = map(thetaVal, 0, rows, 15, 90) + (waveFactor * 14);
      brightVal = constrain(brightVal, 8, 95);

      rowArr.push({ x: x, y: y, z: z, brightness: brightVal });
    }
    flowerPoints.push(rowArr);
  }
}

function drawParticleFlower() {
  push();
  scale(0.09);
  rotateX(55);
  translate(0, 0, 210);

  // 1. Solid occluder core to mask stems behind the flower
  noStroke();
  fill(0, 0, 5); 
  let stepTheta = 1;
  let stepPhi = 2;
  for (let theta = 0; theta < flowerPoints.length - stepTheta; theta += stepTheta) {
    beginShape(TRIANGLE_STRIP);
    for (let phi = 0; phi <= flowerPoints[theta].length; phi += stepPhi) {
      let pIdx = phi % flowerPoints[theta].length;
      let pt1 = flowerPoints[theta][pIdx];
      let pt2 = flowerPoints[theta + stepTheta][pIdx];
      vertex(pt1.x, pt1.y, pt1.z - 0.5);
      vertex(pt2.x, pt2.y, pt2.z - 0.5);
    }
    endShape();
  }

  // 2. Surface particle cloud
  strokeWeight(2.1);
  for (let theta = 0; theta < flowerPoints.length; theta++) {
    for (let phi = 0; phi < flowerPoints[theta].length; phi++) {
      let pt = flowerPoints[theta][phi];
      stroke(0, 0, pt.brightness);
      point(pt.x, pt.y, pt.z);
    }
  }
  pop();
}

function mouseReleased() {
  currentTypeIndex = (currentTypeIndex + 1) % flowerTypes.length;
  generateFlowerMesh(flowerTypes[currentTypeIndex]);
  redraw();
}

function generate() {
  let next = "";
  for(let i = 0; i < word.length; i++) {
    let c = word[i];
    if(c in rules) {
      let ruleSet = rules[c];
      if(Array.isArray(ruleSet)) {
        next += chooseOne(ruleSet);
      } else {
        next += rules[c];
      }
    } else {
      next += c;
    }
  }
  return next;
}

function chooseOne(ruleSet) {
  let n = random();
  let t = 0;
  for(let i = 0; i < ruleSet.length; i++) {
    t += ruleSet[i].prob;
    if(t > n) {
      return ruleSet[i].rule;
    }
  }
  return "";
}