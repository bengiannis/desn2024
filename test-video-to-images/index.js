async function extractFrames(videoFile) {
    return new Promise((resolve, reject) => {
      const frames = [];
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      video.src = URL.createObjectURL(videoFile);
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
  
  function hello() {
    const videoFile = document.querySelector('input[type="file"]').files[0];
    extractFrames(videoFile)
      .then(frames => {
        // 'frames' contains Image objects of all frames
        console.log(frames[0])
      })
      .catch(error => {
        console.error(error);
      });
  }
  