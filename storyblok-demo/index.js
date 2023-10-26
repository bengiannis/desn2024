/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

import { Paragraph } from './paragraph.js';

const components = {
    'paragraph': Paragraph,
    // Add more components here
};

/* ~~~~~~~~~~ Page Builder ~~~~~~~~~~ */

const storyblokInstance = new window.StoryblokBridge();
storyblokInstance.on(['published', 'change'], () => location.reload(true));

const rootElement = document.querySelector("main");

async function fetchDataAndRender(version) {
    const editing = await isInEditor();

    fetch(`https://api-us.storyblok.com/v2/cdn/stories/storyblok-demo?token=Fm5wlsy8rzc1dPxqi1rs9gtt&version=${editing ? "draft" : "published"}`)
    .then(response => response.json())
    .then(data => {
        data.story.content.body.forEach(content => {
            rootElement.appendChild(components[content.component].generate(content));
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