let sizeSlider;
let sizeLabel;
let colourSelect;
let patternSeed = 1;

function setup() {
  let sketch = createDiv();
  sketch.style("width", "400px");
  sketch.style("font-family", "sans-serif");
  sketch.style("border", "1px solid #ddd5e8");
  sketch.style("border-radius", "12px");
  sketch.style("overflow", "hidden");

  let canvas = createCanvas(400, 280);
  canvas.parent(sketch);
  canvas.style("display", "block");
  rectMode(CENTER);
  noStroke();

  let panel = createDiv().parent(sketch);
  panel.style("display", "flex");
  panel.style("align-items", "end");
  panel.style("justify-content", "space-between");
  panel.style("padding", "14px");
  panel.style("background", "#ffffff");
  panel.style("border-top", "1px solid #ddd5e8");

  let sizeGroup = createDiv().parent(panel);
  sizeLabel = createElement("label", "Square size · 24 px").parent(sizeGroup);
  sizeLabel.attribute("for", "square-size");
  sizeLabel.style("display", "block");
  sizeLabel.style("font-size", "13px");
  sizeLabel.style("margin-bottom", "6px");

  sizeSlider = createSlider(8, 36, 24, 1).parent(sizeGroup);
  sizeSlider.id("square-size");
  sizeSlider.style("width", "120px");
  sizeSlider.style("accent-color", "#6941a5");
  sizeSlider.input(updateSizeLabel);

  let colourGroup = createDiv().parent(panel);
  let colourLabel = createElement("label", "Pattern colour").parent(colourGroup);
  colourLabel.attribute("for", "pattern-colour");
  colourLabel.style("display", "block");
  colourLabel.style("font-size", "13px");
  colourLabel.style("margin-bottom", "6px");

  colourSelect = createSelect().parent(colourGroup);
  colourSelect.id("pattern-colour");
  colourSelect.option("Purple", "#8655c5");
  colourSelect.option("Blue", "#3285b8");
  colourSelect.option("Orange", "#d76a32");
  colourSelect.style("padding", "6px");
  colourSelect.style("border", "1px solid #ddd5e8");
  colourSelect.style("border-radius", "6px");

  let shuffleButton = createButton("Shuffle").parent(panel);
  shuffleButton.style("background", "#6941a5");
  shuffleButton.style("color", "#ffffff");
  shuffleButton.style("border", "0");
  shuffleButton.style("border-radius", "6px");
  shuffleButton.style("padding", "8px 12px");
  shuffleButton.style("cursor", "pointer");
  shuffleButton.elt.addEventListener("click", shufflePattern);
}

function draw() {
  background("#f5f1fa");
  randomSeed(patternSeed);

  fill(colourSelect.value());
  let size = sizeSlider.value();

  for (let y = 20; y < height; y += 40) {
    for (let x = 20; x < width; x += 40) {
      if (random() > 0.3) {
        let squareSize = random(size * 0.4, size);
        square(x, y, squareSize);
      }
    }
  }
}

function updateSizeLabel() {
  sizeLabel.html("Square size · " + sizeSlider.value() + " px");
}

function shufflePattern() {
  patternSeed++;
}