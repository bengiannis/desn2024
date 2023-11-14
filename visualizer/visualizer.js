let noiseZ = 0;
let noiseZSpeed = 0.2;
let transitionCanvas;
let imageCache = {};
let specialImages = [];
let pixelData, specialData;

let loaded = false;

let lastExposure = 100;
let exposure = 0;
let exposureCount = 0;

let xOffset = 0;
let yOffset = 0;

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
      const color = data[y][x] === 1 ? [243, 244, 250] : [9, 15, 23];
      let index = 4 * (y * 9 + x);
      img.pixels[index] = color[0];
      img.pixels[index + 1] = color[1];
      img.pixels[index + 2] = color[2];
      img.pixels[index + 3] = 255;
    }
  }
  img.updatePixels();
  return img;
}

// document.addEventListener('wheel', function(event) {
//   xOffset += event.deltaX*0.2;
//   yOffset += event.deltaY*0.2;
// });

async function setup() {
  await loadData(); // Wait for the data to load before setting up canvas
  transitionCanvas = createCanvas(window.innerWidth, window.innerHeight);
  transitionCanvas.parent('visualizer');
  noSmooth();
  frameRate(30);
  windowResized();
}

function windowResized() {
  const threshold = 1440000; // 1200 * 1200
  const area = window.innerWidth * window.innerHeight;
  const resizeFactor = area > threshold ? Math.sqrt(area / threshold) : 1;
  resizeCanvas(window.innerWidth/resizeFactor, window.innerHeight/resizeFactor);
  transitionCanvas.canvas.style.transform = "scale(" + resizeFactor + ")";
  transitionCanvas.canvas.style.transformOrigin = "0 0";
}

function draw() {
  if (!loaded) {
    return;
  }

  let currentSpecialIndex = 0;

  const cols = Math.ceil(width / 9);
  const rows = Math.ceil(height / 9);

  // console.log(noiseZ);

  for (let yReal = 0; yReal < rows; yReal++) {
    const y = yReal + yOffset;
    currentSpecialIndex = yReal % specialImages.length;
    for (let xReal = 0; xReal < cols; xReal++) {
      const x = xReal + xOffset;

      let xWarp = perlinNoise([x, y, 2*noiseZ], 10.0909/(width + height), 1, 0.5);
      let yWarp = perlinNoise([x+500.141, y + 500.141, 2*noiseZ], 10.0769/(width + height), 1, 0.5);
      let distortedX = x + (500*xWarp)
      let distortedY = y + (500*yWarp)

      let noiseValue = perlinNoise([distortedX, distortedY, noiseZ], 5.0588/(width + height), 4, 0.9);
      
      if (yReal == xReal || yReal == cols-xReal) {
        exposure += noiseValue;
        exposureCount++;
      }
      
      noiseValue -= lastExposure;

      noiseValue = Math.pow(4 * Math.max(0, noiseValue - 0.5), 2);
      noiseValue = Math.max(0, Math.min(noiseValue, 1));

      let brightness = Math.floor(noiseValue * 100).toString();

      let img;
      if (Math.abs(specialImages[currentSpecialIndex]["brightness"] - brightness) < 5) {
        img = specialImages[currentSpecialIndex]["array"];
        currentSpecialIndex = (currentSpecialIndex + 1) % specialImages.length;
      } else {
        img = imageCache[brightness];
      }

      image(img, xReal * 9, yReal * 9);
    }
  }

  lastExposure = exposure/exposureCount-0.5;
  exposure = 0;
  exposureCount = 0;

  noiseZ += noiseZSpeed + noiseZSpeed*(width + height)/9999;
}
