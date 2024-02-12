/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

class ImageLeftTextRight {
    static generate(content) {
        const { image, caption, subheading, body } = content;

        const imageLeftTextRightComponent = document.createElement('div');
        imageLeftTextRightComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'image-left-text-right-grid';

        const imageColumn = document.createElement('div');
        imageColumn.className = 'project-component-image-area';
        const img = document.createElement('img');
        img.src = image.filename;
        img.loading = 'lazy';
        img.alt = image.alt;
        img.className = 'project-component-image';
        imageColumn.appendChild(img);

        const captionDiv = document.createElement('div');
        captionDiv.className = 'caption';
        captionDiv.textContent = caption;

        const textColumn = document.createElement('div');
        textColumn.className = 'project-component-text-area';

        if (subheading) {
            const subheadingElement = document.createElement('h4');
            subheadingElement.textContent = subheading;
            textColumn.appendChild(subheadingElement);
        }

        if (typeof body == 'string') {
            const paragraph = document.createElement('p');
            paragraph.className = 'project-component-paragraph';
            paragraph.innerText = body;
        }
        else {
            body.content.forEach(bodyItem => {
                const paragraph = document.createElement('p');
                paragraph.className = 'project-component-paragraph';

                if (!bodyItem.content) {
                    return;
                }
    
                bodyItem.content.forEach(richTextItem => {
                    let text = richTextItem.text;
                    
                    if (richTextItem.marks) {
                        richTextItem.marks.forEach(mark => {
                            if (mark.type === 'link') {
                                text = `<a href="${mark.attrs.href}" target="_blank">${text}</a>`;
                            }
                            else if (mark.type === 'italic') {
                                text = `<i>${text}</i>`;
                            }
                        });
                    }
                    
                    paragraph.innerHTML += text;
                });
    
                textColumn.appendChild(paragraph);
            });
        }

        gridContainer.appendChild(imageColumn);

        if (caption) {
            gridContainer.appendChild(captionDiv);
        }

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

    fetch(`https://api-us.storyblok.com/v2/cdn/stories/projects/${window.location.pathname.split('/').filter(Boolean).pop()}?token=1bXsfgDSA3eGrDuGxB3coAtt&version=${editing ? "draft" : "published"}`)
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
    if (!storyblokInstance) {
        return false;
    }

    return new Promise((resolve) => {
        storyblokInstance.pingEditor(() => {
            resolve(storyblokInstance.isInEditor());
        });
    });
}

fetchDataAndRender();