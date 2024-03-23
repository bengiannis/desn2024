const canvas = document.getElementById('hero');
const ctx = canvas.getContext('2d');

let imageCache = {};
let specialImages = [];
let pixelData, specialData;

let loaded = false;

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

ctx.imageSmoothingEnabled = false
if (window.devicePixelRatio > 1) {
  canvas.width = canvasWidth * window.devicePixelRatio;
  canvas.height = canvasHeight * window.devicePixelRatio;
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

// Call this function to start the animation
async function startAnimation() {
  await loadData();
  drawFrame()
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  for (let i = 0; i < 30; i++) {
    if (specialImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * specialImages.length);
      const imageInfo = specialImages[randomIndex];
      const img = imageInfo.array; // Your createImageFromData function should return a drawable image

      // Random position for each image
      const x = Math.random() * (canvas.width - 9);
      const y = Math.random() * (canvas.height - 9);

      ctx.drawImage(img, x, y);
    }
  }
  console.log("ddfdfdf");
  // requestAnimationFrame(draw);
}

startAnimation();


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
  const width = 9;
  const height = 9;
  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const color = data[y][x] === 1 ? [243, 244, 250] : [9, 15, 23];
      let index = 4 * (y * width + x);
      imageData.data[index] = color[0];
      imageData.data[index + 1] = color[1];
      imageData.data[index + 2] = color[2];
      imageData.data[index + 3] = 255; // alpha value
    }
  }

  // Create a temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');

  // Put the image data onto the temporary canvas
  tempCtx.putImageData(imageData, 0, 0);

  // Return the temporary canvas instead of the image data
  return tempCanvas;
}