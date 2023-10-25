const { StoryblokBridge, location } = window
const storyblokInstance = new StoryblokBridge()
 
storyblokInstance.on(['published', 'change'], () => {
    // reload page if save or publish is clicked
    location.reload(true)
})


// Call pingEditor to see if the user is in the editor
storyblokInstance.pingEditor(() => {
    if (storyblokInstance.isInEditor()) {
        // load the draft version
        fetch("https://api-us.storyblok.com/v2/cdn/stories/storyblok-demo?version=draft&token=Fm5wlsy8rzc1dPxqi1rs9gtt")
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
    } else {
        // load the published version
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
    }
})


