document.addEventListener('DOMContentLoaded', function() {
    const resolutionSlider = document.getElementById("resolutionSlider");
    const resolutionSliderLabel = document.getElementById("resolutionSliderLabel");
    const increaseContrastCheckbox = document.getElementById("increaseContrastCheckbox");
    const dropZone = document.getElementById('dropZone');
    const imageFileInput = document.getElementById('imageFile');
    const canvasBefore = document.getElementById('canvasBefore');
    const canvasAfter = document.getElementById('canvasAfter');
    const ctxBefore = canvasBefore.getContext('2d');
    const ctxAfter = canvasAfter.getContext('2d');
    
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

    async function convertImageToBitmap(img) {
        const resolution = resolutionSlider.value;
        let width = img.width;
        let height = img.height;
    
        // Resize the image if needed
        if (width > resolution || height > resolution) {
            if (width > height) {
                const scale = resolution / width;
                width = resolution;
                height = Math.floor(height * scale);
            } else {
                const scale = resolution / height;
                height = resolution;
                width = Math.floor(width * scale);
            }
        }
    
        canvasBefore.width = width;
        canvasBefore.height = height;
        ctxBefore.drawImage(img, 0, 0, width, height);
    
        const imgData = ctxBefore.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        const increaseContrast = increaseContrastCheckbox.checked;
    
        // Prepare the transformed pixels array for the effect
        const transformedPixels = new Uint8ClampedArray(width * height * 4 * (squareLength * squareLength));
    
        // Process each pixel for the effect
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                let grayscale = (pixels[index] * 0.3 + pixels[index + 1] * 0.59 + pixels[index + 2] * 0.11) / 255;
                if (increaseContrast) {
                    grayscale = (1 - Math.cos(Math.PI * Math.max(0, Math.min(grayscale / 0.8 - 0.1, 1)))) / 2;
                }
                const mappedValue = Math.max(0, Math.min(brightnessScale, Math.floor(grayscale * brightnessScale)));
                let square = [];
    
                if (Math.abs(specialData[currentSpecialIndex]["brightness"] - mappedValue) < 8) {
                    square = specialData[currentSpecialIndex]["array"];
                    currentSpecialIndex = (currentSpecialIndex >= specialCount - 1) ? 0 : currentSpecialIndex + 1;
                } else {
                    square = pixelData[mappedValue];
                }
    
                for (let i = 0; i < squareLength; i++) {
                    for (let j = 0; j < squareLength; j++) {
                        const brightness = square[i][j] * 255;
                        const transformedIndex = (((y * squareLength + i) * width * squareLength) + (x * squareLength + j)) * 4;
                        transformedPixels[transformedIndex] = brightness;
                        transformedPixels[transformedIndex + 1] = brightness;
                        transformedPixels[transformedIndex + 2] = brightness;
                        transformedPixels[transformedIndex + 3] = 255;  // Alpha channel
                    }
                }
            }
        }
    
        // Prepare the canvas for the final image
        canvasAfter.width = width * squareLength;
        canvasAfter.height = height * squareLength + 200;  // Add 200px for the footer
        const newImgData = ctxAfter.createImageData(canvasAfter.width, canvasAfter.height);
        newImgData.data.set(transformedPixels);
        ctxAfter.putImageData(newImgData, 0, 0);
    
        // Fill the footer background (optional, white here)
        ctxAfter.fillStyle = "#FFFFFF";
        ctxAfter.fillRect(0, height * squareLength, canvasAfter.width, 200);
    
        // Load and center the logo in the footer
        const logo = new Image();
        logo.src = './logo.svg';
        await new Promise(resolve => {
            logo.onload = () => {
                const logoWidth = logo.width;
                const logoHeight = logo.height;
                const logoX = (canvasAfter.width - logoWidth) / 2;
                const logoY = height * squareLength + (200 - logoHeight) / 2;
                ctxAfter.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
                resolve();
            };
        });
    
        const dataURL = canvasAfter.toDataURL('image/png');
        return dataURL;
    }    

    async function generateImage(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => {
            img.onload = () => {
                resolve();
            };
        });

        const convertedImage = await convertImageToBitmap(img);

        // Trigger download of the transformed image
        const link = document.createElement('a');
        link.href = convertedImage;
        link.download = `Resolution-${resolutionSlider.value}${increaseContrastCheckbox.checked ? '-H' : ''}-${file.name.split('.').slice(0, -1).join('.')}.png`;
        link.click();
    }

    // Add drag-and-drop and file input functionalities
    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('drop', async function(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            await generateImage(file);
        }
    });

    dropZone.addEventListener('click', function() {
        imageFileInput.click();
    });

    resolutionSlider.addEventListener("input", function() {
        resolutionSliderLabel.textContent = resolutionSlider.value;
    });
    resolutionSliderLabel.textContent = resolutionSlider.value;

    imageFileInput.addEventListener('change', async function(event) {
        event.preventDefault();
        const file = imageFileInput.files[0];
        if (file) {
            await generateImage(file);
        }
    });
});
