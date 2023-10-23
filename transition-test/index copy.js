let noiseZ = 0;
let noiseZIncrement = 0.1;  // Speed of animation

let transitionCanvas;

const squareLength = 9;
let brightnessScale = 1;
let specialCount = 0;

let currentSpecialIndex = 0;

let pixelData = {}
  fetch('/design/pixels.json')
  .then(response => response.json())
  .then(data => {
    pixelData = data;
    brightnessScale = Object.keys(pixelData).length - 1;
  });

  let specialData = {}
  fetch('/design/special.json')
  .then(response => response.json())
  .then(data => {
    specialData = data;
    specialCount = Object.keys(specialData).length;
});

// Define the perlinNoise function
function perlinNoise(coordinate, scale, detail = 1, roughness = 0) {
  let [x, y, z = 0] = coordinate;
  let frequency = 1;
  let amplitude = 1;
  let output = 0;
  let amplitudeSum = 0;

  x *= scale;
  y *= scale;
  z *= scale;

  for (let i = 0; i < detail; i++) {
    output += noise(x * frequency, y * frequency, z * frequency) * amplitude;
    amplitudeSum += amplitude;

    // Update frequency and amplitude for the next octave
    frequency *= 2;
    amplitude *= roughness;
  }

  // Normalize to [0, 1]
  output = output / amplitudeSum;
  return output;
}

// p5.js setup function
function setup() {
  // Create a canvas of 200x200 pixels
  // noiseSeed(99);
  transitionCanvas = createCanvas(window.innerWidth, window.innerHeight);
  transitionCanvas.parent('transition-canvas-container');
}

function draw() {
  const cols = Math.floor(width / 9);
  const rows = Math.floor(height / 9);
  const transitionCtx = transitionCanvas.drawingContext;  // Define it here if not already defined in setup()

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let noiseValue = perlinNoise([x, y, noiseZ], 0.1);
      noiseValue = (1 - Math.cos(Math.PI * Math.max(0, Math.min(noiseValue / 0.8 - 0.4, 1)))) / 2;
      let brightness = Math.floor(noiseValue * 100);

      //let index = Math.floor(noiseValue * 100);
      let square = [];

      if (Math.abs(specialData[currentSpecialIndex]["brightness"] - brightness) < 8) {
        square = specialData[currentSpecialIndex]["array"];
        currentSpecialIndex = (currentSpecialIndex >= specialCount - 1) ? 0 : currentSpecialIndex + 1;
      }
      else {
        square = pixelData[brightness];
      }

      for (let subX = 0; subX < 9; subX++) {
        for (let subY = 0; subY < 9; subY++) {
          let subBrightness = square[subY][subX] * 255;
          transitionCtx.fillStyle = `rgb(${subBrightness},${subBrightness},${subBrightness})`;
          transitionCtx.fillRect(x * 9 + subX, y * 9 + subY, 9, 9);
        }
      }
    }
  }

  noiseZ += noiseZIncrement;  // Increment z for the next frame
}