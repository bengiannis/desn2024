
document.addEventListener('DOMContentLoaded', function() {
    const resolutionSlider = document.getElementById("resolutionSlider");
    const resolutionSliderLabel = document.getElementById("resolutionSliderLabel");
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
    fetch('pixels.json')
    .then(response => response.json())
    .then(data => {
        pixelData = data;
        brightnessScale = Object.keys(pixelData).length - 1;
    });

    let specialData = {}
    fetch('special.json')
    .then(response => response.json())
    .then(data => {
        specialData = data;
        specialCount = Object.keys(specialData).length;
    });

    async function convertImage(file) {
        if (!file) {
            alert('Please upload an image first.');
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => {
            img.onload = () => {
                resolve();
            };
        });

        const resolution = resolutionSlider.value;

        // Resize the image if its longest side is greater than desired resolution
        let width = img.width;
        let height = img.height;
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
            canvasBefore.width = width;
            canvasBefore.height = height;
            ctxBefore.drawImage(img, 0, 0, width, height);
        } else {
            canvasBefore.width = width;
            canvasBefore.height = height;
            ctxBefore.drawImage(img, 0, 0, width, height);
        }

        canvasBefore.width = width;
        canvasBefore.height = height;
        
        ctxBefore.drawImage(img, 0, 0, width, height);
        
        const imgData = ctxBefore.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        const increaseContrast = document.getElementById('increaseContrastCheckbox').checked;

        // Create an array for the final transformed image
        const transformedPixels = new Uint8ClampedArray(width * height * 4 * (squareLength*squareLength));

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
                    //(change above to range if needed)
                    square = specialData[currentSpecialIndex]["array"];
                    currentSpecialIndex = (currentSpecialIndex >= specialCount - 1) ? 0 : currentSpecialIndex + 1;
                }
                else {
                    square = pixelData[mappedValue];
                }

                // Loop through the square and populate the transformedPixels array
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

        canvasAfter.width = width * squareLength;
        canvasAfter.height = height * squareLength;
        const newImgData = ctxAfter.createImageData(canvasAfter.width, canvasAfter.height);
        newImgData.data.set(transformedPixels);
        ctxAfter.putImageData(newImgData, 0, 0);

        // Trigger download of the transformed image
        const a = document.createElement('a');
        a.href = canvasAfter.toDataURL('image/png');
        a.download = 'transformed_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
            await convertImage(file);
        }
    });

    dropZone.addEventListener('click', function() {
        imageFileInput.click();
    });

    resolutionSlider.addEventListener("input", function() {
        resolutionSliderLabel.textContent = resolutionSlider.value;
    });
    resolutionSliderLabel.textContent = resolutionSlider.value;

    imageFileInput.addEventListener('change', async function() {
        const file = imageFileInput.files[0];
        if (file) {
            await convertImage(file);
        }
    });
});
