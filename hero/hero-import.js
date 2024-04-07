// Hero Animation

let canvas;

let FKRasterRomanCompactFont;

let resizeFactor = 1;

let imageCache = {};
let specialImages = [];
let pixelData, specialData;

let loadedPixels = false;
let loadedTextImageData = false;
let currentText = "";
let currentTextImageData = {9: [], 18: [], 36: [], 72: [], 144: [], 288: []};
let fractalNoiseLimits = {9: 1, 18: 0.48, 36: 0.36, 72: 0.24, 144: 0.20, 288: 0.16};

let gain = 0.5;

// Canvas Setup

function preload() {
  FKRasterRomanCompactFont = loadFont('https://resources.desn2024.com/fonts/FKRasterRomanCompact/FKRasterRomanCompact-Blended.otf');
}

async function setup() {
  await loadData(); // Wait for the data to load before setting up canvas
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('hero');
  noSmooth();
  frameRate(30);
  windowResized();

  renderTextImageData("It's Clear Now");
  // renderTextImageData("Resolution isn't just an exhibition");
  // renderTextImageData("It's a declaration of who we are");
  // renderTextImageData("And what design makes us");
}

function windowResized() {
  const threshold = 1440000; // 1200 * 1200
  const area = window.innerWidth * window.innerHeight;
  resizeFactor = area > threshold ? Math.sqrt(area / threshold) : 1;
  resizeCanvas(window.innerWidth/resizeFactor, window.innerHeight/resizeFactor);
  canvas.canvas.style.transform = "scale(" + resizeFactor + ")";
  canvas.canvas.style.transformOrigin = "0 0";

  renderTextImageData();
}

// Canvas Loop


function draw() {
  if (!loadedPixels || !loadedTextImageData) {
    return;
  }

  for (const scale in currentTextImageData) {
    const cols = Math.ceil(width / scale);
    const rows = Math.ceil(height / scale);
    let currentSpecialIndex = 0;
  
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const noiseX = noise(x);
        const noiseY = noise(y);
        const noiseFrame = noise(frameCount / 40);
        const noiseTotal = (noiseX + noiseY + noiseFrame)/3;

        let fractalNoise;
        if (frameCount < 90) {
          // Intro Animation
          fractalNoise = Math.min(frameCount / (120 - noiseTotal*70), 1) - Math.min(Math.max(0, (frameCount - 60) / 30), 1) + noise(frameCount / 30 + noiseX + noiseY) * Math.min(Math.max(0.1, (frameCount - 60) / 30), 1);
        }
        else {
          fractalNoise = noise(frameCount / 30 + noiseX + noiseY) * (1 - Math.abs(2 * gain - 1)) + Math.max(0, 1 - 2 * gain) + Math.max(0, 0.35 * (gain - 0.5));
        }

        if (fractalNoise > fractalNoiseLimits[scale]) {
          continue;
        }
        
        const scrollOffset = Math.round((((window.scrollY/(scale)/2)) % noise(scale+20*noiseTotal)*(scale/36)));

        const xOffset = Math.round((noise(y + scale) - 0.5) * (Math.max(0, (0.8 - fractalNoiseLimits[scale])) * noiseFrame*100));
        const yOffset = Math.round((noise(x + scale) - 0.5) * (Math.max(0, (0.8 - fractalNoiseLimits[scale])) * noiseFrame*100)) + scrollOffset;

        const brightnessIndex = Math.max(0, Math.min(Math.round((y + yOffset) * cols + (x + xOffset)), cols * rows));
        const avgBrightness = currentTextImageData[scale][brightnessIndex] || 0;
  
        let brightness = Math.floor(avgBrightness / 255 * Math.floor(((noise(frameCount/100) + noiseX + noiseY)/3)*100)).toString();
  
        let img;
        if (Math.abs(specialImages[currentSpecialIndex].brightness - brightness) < 5) {
          img = specialImages[currentSpecialIndex].array;
          currentSpecialIndex = (currentSpecialIndex + 1) % specialImages.length;
        } else {
          img = imageCache[brightness];
        }
  
        image(img, x * scale, y * scale, scale, scale);
      }
    }
  }
}

// Functions

async function loadData() {
  const pixelResponse = await fetch('https://resources.desn2024.com/design/pixels.json');
  pixelData = await pixelResponse.json();
  const specialResponse = await fetch('https://resources.desn2024.com/design/special.json');
  specialData = await specialResponse.json();

  Object.keys(pixelData).forEach(key => {
    imageCache[key] = createImageFromData(pixelData[key]);
  });

  Object.keys(specialData).forEach((key, index) => {
    specialImages[index] = {"brightness": specialData[key]["brightness"], "array": createImageFromData(specialData[key]['array'])};
  });

  loadedPixels = true;
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

function renderTextImageData(txt = currentText) {
  currentText = txt;

  const fontSize = width/32 + 72;

  for (const scale in currentTextImageData) {

    const maxWidth = Math.min((width - 48)/scale, fontSize * 0.9);

    let scaledW = Math.ceil(width / scale);
    let scaledH = Math.ceil(height / scale);

    let img = createImage(scaledW, scaledH);
    img.loadPixels();

    let graphics = createGraphics(scaledW, scaledH);
    graphics.background(0);
    graphics.fill(255);
    graphics.textFont(FKRasterRomanCompactFont);
    graphics.textAlign(CENTER, CENTER);
    graphics.textSize(fontSize / scale);
    graphics.text(txt, (scaledW - 2.5 - 0.75 - maxWidth) / 2, (scaledH - 0.75) / 2, maxWidth);
    img.updatePixels();
    img.copy(graphics, 0, 0, scaledW, scaledH, 0, 0, scaledW, scaledH);

    img.loadPixels();
    const cols = Math.ceil(scaledW);
    const rows = Math.ceil(scaledH);
    brightnessValues = new Array(cols * rows);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = (y * img.width + x) * 4;
        brightnessValues[y * cols + x] = img.pixels[index];
      }
    }

    currentTextImageData[scale] = brightnessValues;
  }

  loadedTextImageData = true;
}


let animationFrameId = null;
let startTime = null;
let initialGain = 0;
let targetGain = 1;
let duration = 1000; // duration in milliseconds
let phase = 0;
let textToAnimateTo = "";
let immediate = false;
let shownFullTextAlready = false;

function animateToNewText(newText, immediately) {
  immediate = immediately;
	textToAnimateTo = newText;
	startAnimation();
}

let currentZone = 0;
let currentTextSection = 0;

const sectionTitles = ["It's Clear Now", "Resolution isn't just an exhibition", "It's a declaration of who we are", "And what design makes us"];
const heroContainer = document.getElementById("hero-container");

const checkAndUpdateSection = () => {
  const heroHeight = heroContainer.offsetHeight - window.innerHeight;
  const zoneHeight = heroHeight / 8;
  const newZone = Math.max(0, Math.min(Math.floor(window.scrollY / zoneHeight), 7));
  const newSection = Math.max(0, Math.min(Math.floor(newZone / 2), 3));

  if (newZone !== currentZone) {
    currentTextSection = newSection;
    shownFullTextAlready = (newSection != currentTextSection);
    const immediately = !shownFullTextAlready;
    animateToNewText(sectionTitles[currentTextSection], immediately);
  }
};

window.addEventListener('scroll', checkAndUpdateSection);
window.addEventListener('resize', checkAndUpdateSection);


const animateGain = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const progress = Math.min((timestamp - startTime) / duration, 1);
  gain = initialGain + (targetGain - initialGain) * progress;

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animateGain);
  } else {
    phase++;
    switch (phase) {
      case 1:
        // Animate to 0
        renderTextImageData(textToAnimateTo);
        initialGain = gain;
        targetGain = 0.25;
        duration = immediate ? 50 : 800;
        break;
      case 2:
        // Hold at 0 for 1 second
        initialGain = gain;
        targetGain = 0.25;
        duration = 100;
        shownFullTextAlready = true;
        break;
      case 3:
        // Animate to 0.5
        initialGain = gain;
        targetGain = (currentTextSection == 0) ? 0.5 : 0.4;
        duration = 400;
        break;
      default:
        return;
    }
    startTime = null;
    animationFrameId = requestAnimationFrame(animateGain);
  }
};

const startAnimation = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  phase = 0;
  initialGain = gain; // Assuming 'gain' is defined elsewhere
  targetGain = 1;
  duration = immediate ? 100 : 700;
  startTime = null;
  animationFrameId = requestAnimationFrame(animateGain);
};