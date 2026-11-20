let sizeSlider;
let colourSelect;
let patternSeed = 1;

function setup() {
  createCanvas(400, 300);
  rectMode(CENTER);
  noStroke();

  let sizeRow = createDiv();
  createElement("label", "Size ").attribute("for", "square-size").parent(sizeRow);
  sizeSlider = createSlider(8, 36, 24);
  sizeSlider.id("square-size").parent(sizeRow);

  let colourRow = createDiv();
  createElement("label", "Colour ").attribute("for", "square-colour").parent(colourRow);
  colourSelect = createSelect();
  colourSelect.id("square-colour").parent(colourRow);
  colourSelect.option("Purple");
  colourSelect.option("Blue");
  colourSelect.option("Orange");

  let shuffleButton = createButton("Shuffle");
  shuffleButton.mousePressed(shufflePattern);
}

function draw() {
  background(245);
  randomSeed(patternSeed);

  let colours = {
    Purple: "#8655c5",
    Blue: "#3285b8",
    Orange: "#d76a32"
  };

  fill(colours[colourSelect.value()]);
  let size = sizeSlider.value();

  for (let x = 25; x < width; x += 50) {
    for (let y = 25; y < height; y += 50) {
      if (random() > 0.3) {
        let squareSize = random(size * 0.4, size);
        square(x, y, squareSize);
      }
    }
  }
}

function shufflePattern() {
  patternSeed++;
}