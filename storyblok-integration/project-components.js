/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

class ImageLeftTextRight {
    static generate(content) {
        const { Text } = content;

        const imageLeftTextRightComponent = document.createElement('div');
        imageLeftTextRightComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'image-left-text-right-grid';

        const imageColumn = document.createElement('div');
        imageColumn.className = 'project-component-image-column';
        const img = document.createElement('img');
        img.src = 'https://source.unsplash.com/random';
        img.loading = 'lazy';
        img.alt = '';
        img.className = 'project-component-image';
        imageColumn.appendChild(img);

        const captionDiv = document.createElement('div');
        captionDiv.className = 'caption';
        captionDiv.textContent = 'Optional Caption';

        const textColumn = document.createElement('div');
        textColumn.className = 'project-component-text-column';

        const heading = document.createElement('h4');
        heading.textContent = 'Heading';
        textColumn.appendChild(heading);

        const paragraph = document.createElement('p');
        paragraph.className = 'project-component-paragraph';
        paragraph.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. <a href="#">Duis cursus</a>, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.';
        textColumn.appendChild(paragraph);

        gridContainer.appendChild(imageColumn);
        gridContainer.appendChild(captionDiv);
        gridContainer.appendChild(textColumn);

        imageLeftTextRightComponent.appendChild(gridContainer);

        return imageLeftTextRightComponent;
    }
}

const components = {
    "imageLeftTextRight": ImageLeftTextRight
    // Add more components here
};

/* ~~~~~~~~~~ Page Builder ~~~~~~~~~~ */

const storyblokInstance = new window.StoryblokBridge();
storyblokInstance.on(['published', 'change'], () => location.reload(true));

const rootElement = document.getElementById("project-components");

async function fetchDataAndRender(version) {
    const editing = await isInEditor();

    fetch(`https://api-us.storyblok.com/v2/cdn/stories/storyblok-demo?token=Fm5wlsy8rzc1dPxqi1rs9gtt&version=${editing ? "draft" : "published"}`)
    .then(response => response.json())
    .then(data => {
        data.story.content.body.forEach(content => {
            if (components.hasOwnProperty(content.component)) {
                rootElement.appendChild(components[content.component].generate(content));
            }
        });
    })
    .catch(error => console.error("Error fetching data:", error));
};

async function isInEditor() {
    return new Promise((resolve) => {
        storyblokInstance.pingEditor(() => {
            resolve(storyblokInstance.isInEditor());
        });
    });
}

fetchDataAndRender();