let noiseZ = 0;
let noiseZSpeed = 0.2;
let transitionCanvas;
let imageCache = {};
let specialImages = [];
let pixelData, specialData;

let loaded = false;

// Define the perlinNoise function
function perlinNoise(coordinate, scale, detail = 1, roughness = 0) {
  let [x, y = 0, z = 0] = coordinate;
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

async function loadData() {
  const pixelResponse = await fetch('/design/pixels.json');
  pixelData = await pixelResponse.json();
  const specialResponse = await fetch('/design/special.json');
  specialData = await specialResponse.json();

  Object.keys(pixelData).forEach(key => {
    imageCache[key] = createImageFromData(pixelData[key]);
  });

  Object.keys(specialData).forEach((key, index) => {
    specialImages[index] = {"brightness": specialData[key]["brightness"], "array": createImageFromData(specialData[key]['array'])};
  });

  loaded = true;
}

function createImageFromData(data) {
  const img = createImage(9, 9);
  img.loadPixels();
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      let brightness = data[y][x] * 255;
      let index = 4 * (y * 9 + x);
      img.pixels[index] = brightness;
      img.pixels[index + 1] = brightness;
      img.pixels[index + 2] = brightness;
      img.pixels[index + 3] = 255;
    }
  }
  img.updatePixels();
  return img;
}

async function setup() {
  await loadData(); // Wait for the data to load before setting up canvas
  transitionCanvas = createCanvas(window.innerWidth, window.innerHeight);
  transitionCanvas.parent('visualizer');
  noSmooth();
  frameRate(30);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  if (!loaded) {
    return;
  }

  let currentSpecialIndex = 0;

  const cols = Math.ceil(width / 9);
  const rows = Math.ceil(height / 9);

  for (let y = 0; y < rows; y++) {
    currentSpecialIndex = y % specialImages.length;
    for (let x = 0; x < cols; x++) {
      let xWarp = perlinNoise([x, y, noiseZ], 10/(width + height), 1, 0.5);
      let yWarp = perlinNoise([x+500.141, y + 500.141, noiseZ], 10/(width + height), 1, 0.5);
      let distortedX = x + (500*xWarp)
      let distortedY = y + (500*yWarp)

      let noiseValue = perlinNoise([distortedX, distortedY, noiseZ], 20/(width + height), 2, 0.3);

      // noiseValue = Math.max(0, Math.sin(distortedX/2)) + Math.max(0, Math.sin(distortedY/2))
      // noiseValue = (1 - Math.cos(Math.PI * Math.max(0, Math.min(noiseValue / 0.6 - 0.2, 1)))) / 2;
      // console.log(noiseValue);
      // noiseValue = 1 - Math.sqrt(3 * Math.abs(noiseValue - 0.5));
      // noiseValue = 2 / (15 * Math.abs(noiseValue - 0.5) + 1) - 1;
      noiseValue = Math.pow(2 * Math.max(0, noiseValue - 0.4), 2);
      noiseValue = Math.max(0, Math.min(noiseValue, 1))
      //noiseValue = Math.pow(Math.sin(Math.PI * noiseValue), 9);

      let brightness = Math.floor(noiseValue * 100).toString();

      let img;
      if (Math.abs(specialImages[currentSpecialIndex]["brightness"] - brightness) < 5) {
        img = specialImages[currentSpecialIndex]["array"];
        currentSpecialIndex = (currentSpecialIndex + 1) % specialImages.length;
      } else {
        img = imageCache[brightness];
      }

      image(img, x * 9, y * 9);
    }
  }

  noiseZ += noiseZSpeed + noiseZSpeed*(width + height)/9999;
}
