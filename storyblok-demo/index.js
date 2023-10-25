fetch("https://api-us.storyblok.com/v2/cdn/stories/storyblok-demo?token=Fm5wlsy8rzc1dPxqi1rs9gtt")
  .then(response => response.json())
  .then(data => {
    const bodyContent = data.story.content.body;
    const mainElement = document.querySelector("main");
    
    bodyContent.forEach(item => {
      const paragraph = document.createElement("p");
      paragraph.textContent = item.Text;
      mainElement.appendChild(paragraph);
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
