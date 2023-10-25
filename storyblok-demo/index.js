const { StoryblokBridge } = window;
const storyblokInstance = new StoryblokBridge();
storyblokInstance.on(['published', 'change'], () => location.reload(true));

const apiUrl = "https://api-us.storyblok.com/v2/cdn/stories/storyblok-demo";


/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

const components = {
    'paragraph': generateParagraph,
    // Add more mappings here
};


/* ~~~~~~~~~~ Component Generators ~~~~~~~~~~ */

function generateParagraph(content) {
    const paragraph = document.createElement("p");
    paragraph.textContent = content.Text;

    return paragraph;
}




/* ~~~~~~~~~~ Page Builder ~~~~~~~~~~ */

const rootElement = document.querySelector("main");


async function fetchDataAndRender(version) {
    const editing = await isInEditor();

    fetch(`${apiUrl}?token=Fm5wlsy8rzc1dPxqi1rs9gtt&version=${editing ? "draft" : "published"}`)
    .then(response => response.json())
    .then(data => {
        const { body } = data.story.content;

        body.forEach(item => {
            let component = components[item.component](item);
            rootElement.appendChild(component);
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