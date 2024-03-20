document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const imageFileInput = document.getElementById('imageFile');
    const canvasBefore = document.getElementById('canvasBefore');
    const canvasAfter = document.getElementById('canvasAfter');
    const ctxBefore = canvasBefore.getContext('2d');
    const ctxAfter = canvasAfter.getContext('2d');
    
    async function makeImagePhotoBoothReady(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Set canvas size
        canvas.width = 900;
        canvas.height = 1500;
    
        // Fill background with white
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Calculate scale and position for object-fit: cover;
        const imgRatio = img.width / img.height;
        const targetRatio = 900 / 1300;
        let drawWidth, drawHeight, offsetX, offsetY;
    
        if (imgRatio > targetRatio) {
            // Image is wider than target
            drawHeight = 1300;
            drawWidth = img.width * (drawHeight / img.height);
            offsetX = (900 - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller than target
            drawWidth = 900;
            drawHeight = img.height * (drawWidth / img.width);
            offsetX = 0;
            offsetY = (1300 - drawHeight) / 2;
        }
    
        // Draw the image centered and covering the specified part
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
        // Convert the entire canvas (image) to greyscale using NTSC formula
        let imageData = ctx.getImageData(0, 0, 900, 1500);
        for (let i = 0; i < imageData.data.length; i += 4) {
            let grey = 0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2];
            imageData.data[i] = grey;
            imageData.data[i + 1] = grey;
            imageData.data[i + 2] = grey;
        }
        ctx.putImageData(imageData, 0, 0);
    
        // Clear the bottom area before drawing the logo
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 1300, 900, 200);
    
        // Load the logo
        const logo = await new Promise((resolve) => {
            const logoImg = new Image();
            logoImg.onload = () => resolve(logoImg);
            logoImg.src = './logo.svg';
        });
    
        // Calculate logo dimensions to maintain aspect ratio
        const logoHeight = (logo.height / logo.width) * 300;
        const logoY = 1300 + (200 - logoHeight) / 2;
    
        // Draw the logo in the bottom center with a width of 300px
        ctx.drawImage(logo, (canvas.width - 300) / 2, logoY, 300, logoHeight);
    
        // Return the canvas data as a data URL
        return canvas.toDataURL();
    }
    

    async function generateImage(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => {
            img.onload = () => {
                resolve();
            };
        });

        const convertedImage = await makeImagePhotoBoothReady(img);

        // Trigger download of the transformed image
        const link = document.createElement('a');
        link.href = convertedImage;
        link.download = `Resolution-Photo-Booth-${new Date().toISOString()}-${file.name.split('.').slice(0, -1).join('.')}.png`;
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
