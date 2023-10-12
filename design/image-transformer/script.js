
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const imageFileInput = document.getElementById('imageFile');
    const canvasBefore = document.getElementById('canvasBefore');
    const canvasAfter = document.getElementById('canvasAfter');
    const ctxBefore = canvasBefore.getContext('2d');
    const ctxAfter = canvasAfter.getContext('2d');

    let pixelData = {}
    fetch('pixels.json')
    .then(response => response.json())
    .then(data => {
        pixelData = data;
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

        // Resize the image if its longest side is greater than 300px
        let width = img.width;
        let height = img.height;
        if (width > 300 || height > 300) {
            if (width > height) {
                const scale = 300 / width;
                width = 300;
                height = Math.floor(height * scale);
            } else {
                const scale = 300 / height;
                height = 300;
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

        // Create an array for the final transformed image
        const transformedPixels = new Uint8ClampedArray(width * height * 4 * 49);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const grayscale = pixels[index] * 0.3 + pixels[index + 1] * 0.59 + pixels[index + 2] * 0.11;
                const mappedValue = Math.floor((grayscale / 255) * 20);
                const square7x7 = pixelData[Math.max(1, Math.min(20, mappedValue))];

                // Loop through the 7x7 square and populate the transformedPixels array
                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < 7; j++) {
                        const brightness = square7x7[i][j] * 255;
                        const transformedIndex = (((y * 7 + i) * width * 7) + (x * 7 + j)) * 4;
                        transformedPixels[transformedIndex] = brightness;
                        transformedPixels[transformedIndex + 1] = brightness;
                        transformedPixels[transformedIndex + 2] = brightness;
                        transformedPixels[transformedIndex + 3] = 255;  // Alpha channel
                    }
                }
            }
        }

        canvasAfter.width = width * 7;
        canvasAfter.height = height * 7;
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

    imageFileInput.addEventListener('change', async function() {
        const file = imageFileInput.files[0];
        if (file) {
            await convertImage(file);
        }
    });
});
