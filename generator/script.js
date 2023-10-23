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
    
    const frameRate = 30;

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

    /*async function captureFrames(file) {
        return new Promise(async (resolve, reject) => {
            const videoElement = document.createElement('video');
            const objectURL = URL.createObjectURL(file);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            document.body.appendChild(canvas)
            canvas.style.background = "black"
            const frames = [];
        
            videoElement.src = objectURL;
            await videoElement.play();  // Autoplay requirement for some browsers
        
            videoElement.addEventListener('loadeddata', async () => {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
        
                const duration = videoElement.duration;
                const totalFrames = Math.floor(duration * frameRate);
        
                for (let i = 0; i < totalFrames; i++) {
                const currentTime = i / frameRate;
        
                // Seek to time and wait for 'seeked' event
                await new Promise(r => {
                    videoElement.addEventListener('seeked', r, { once: true });
                    videoElement.currentTime = currentTime;
                });
        
                // Draw frame on canvas
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
                // Convert to Image object
                const img = new Image();
                img.src = canvas.toDataURL();
                frames.push(img);
                }
        
                URL.revokeObjectURL(objectURL);  // Clean up
                resolve(frames);
            });
        });
    }*/

    async function captureFrames(file) {
        return new Promise((resolve, reject) => {
            const frames = [];
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
        
            video.src = URL.createObjectURL(file);
            video.load();
        
            console.log("starting")
        
            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });
        
            video.addEventListener('loadeddata', async () => {
                console.log("loaddata")
                let currentTime = 0;
                const interval = 1 / 30; // You can change the interval
        
                while (currentTime < video.duration) {
                console.log((currentTime / video.duration * 100) + "%");
                video.currentTime = currentTime;
                await new Promise(r => video.addEventListener('seeked', r, { once: true }));
        
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const img = new Image();
                img.src = canvas.toDataURL();
                await new Promise(r => img.addEventListener('load', r, { once: true }));
        
                frames.push(img);
                currentTime += interval;
                }
        
                resolve(frames);
            });
        
            video.addEventListener('error', (e) => {
                reject(e);
            });
        });
    }

    async function generateVideo(file) {
        const frames = await captureFrames(file, frameRate);

        const encoder = new Whammy.Video(frameRate);

        for (let frame of frames) {
            // console.log(frame);
            const convertedFrame = await convertImageToBitmap(frame);

            const img = new Image();
            img.src = frame;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Draw image onto canvas
                ctx.drawImage(img, 0, 0);
    
                // Add this frame to encoder
                encoder.add(ctx);
            };
        }

        console.log("boo");

        encoder.compile(false, function(output) {
            const url = URL.createObjectURL(output);
    
            // // Do something with the video URL (e.g., download it)
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = `Resolution-${resolutionSlider.value}${increaseContrastCheckbox.checked ? '-H' : ''}-${file.name.split('.').slice(0, -1).join('.')}.webm`;
            // a.click();
        });
    }

    async function convertImageToBitmap(img) {
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
        const increaseContrast = increaseContrastCheckbox.checked;

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

        const dataURL = canvasAfter.toDataURL('image/png');
        return dataURL;
        console.log("HAHAHA", dataURL)
        const newImg = new Image();
        newImg.src = dataURL;
        return newImg;
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
            if (file.type.startsWith('image/')) {
                await generateImage(file);
            }
            else if (file.type.startsWith('video/')) {
                await generateVideo(file);
            }
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
            if (file.type.startsWith('image/')) {
                await generateImage(file);
            }
            else if (file.type.startsWith('video/')) {
                await generateVideo(file);
            }
        }
    });
});
