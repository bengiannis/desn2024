/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

class ImageAndText {
    static generate(content) {
        const { imageAlignment, image, caption, subheading, body } = content;

        const imageAndTextComponent = document.createElement('div');
        imageAndTextComponent.className = 'project-component';

        const gridContainer = document.createElement('div');

        gridContainer.className = (imageAlignment == "right") ? "text-left-image-right-grid" : "image-left-text-right-grid";

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

        imageAndTextComponent.appendChild(gridContainer);

        return imageAndTextComponent;
    }
}

class TwoImages {
    static generate(content) {
        const { image1, image2, caption1, caption2 } = content;

        const twoImagesComponent = document.createElement('div');
        twoImagesComponent.className = 'project-component';

        const gridContainer = document.createElement('div');

        gridContainer.className = "image-left-image-right-grid";

        const image1Column = document.createElement('div');
        image1Column.className = 'project-component-image-area';
        image1Column.classList.add("project-component-image-area", "left");
        const img1 = document.createElement('img');
        img1.src = image1.filename;
        img1.loading = 'lazy';
        img1.alt = image1.alt;
        img1.className = 'project-component-image';
        image1Column.appendChild(img1);

        const caption1Div = document.createElement('div');
        caption1Div.classList.add("caption", "in-large-grid", "left");
        caption1Div.textContent = caption1;

        const image2Column = document.createElement('div');
        image2Column.classList.add("project-component-image-area", "right");
        const img2 = document.createElement('img');
        img2.src = image1.filename;
        img2.loading = 'lazy';
        img2.alt = image1.alt;
        img2.className = 'project-component-image';
        image2Column.appendChild(img2);

        const caption2Div = document.createElement('div');
        caption2Div.classList.add("caption", "in-large-grid", "right");
        caption2Div.textContent = caption2;

        gridContainer.appendChild(image1Column);

        if (caption1) {
            gridContainer.appendChild(caption1Div);
        }

        gridContainer.appendChild(image2Column);

        if (caption2) {
            gridContainer.appendChild(caption2Div);
        }

        twoImagesComponent.appendChild(gridContainer);

        return twoImagesComponent;
    }
}

const components = {
    "image_and_text": ImageAndText,
    "two_images": TwoImages,
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