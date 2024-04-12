/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

class SingleImage {
    static generate(content) {
        const { alignment, image, caption } = content;

        const singleImageComponent = document.createElement('div');
        singleImageComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        gridContainer.className = alignment === "full" ? "full-width-image-grid" : (alignment === "right" ? "wide-right-image-grid" : "wide-left-image-grid");

        const imageColumn = document.createElement('div');
        imageColumn.className = "project-component-image-area";
        const img = document.createElement('img');
        img.src = image.filename;
        img.loading = 'lazy';
        img.alt = image.alt;
        img.className = 'project-component-image';
        imageColumn.appendChild(img);

        const captionDiv = document.createElement('div');
        captionDiv.className = "caption";
        captionDiv.textContent = caption.replace(/\s(?=[^\s]*$)/, '\u00A0');

        gridContainer.appendChild(imageColumn);

        if (caption) {
            gridContainer.appendChild(captionDiv);
        }

        singleImageComponent.appendChild(gridContainer);

        return singleImageComponent;
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
        image1Column.classList.add("project-component-image-area", "left");
        const img1 = document.createElement('img');
        img1.src = image1.filename;
        img1.loading = 'lazy';
        img1.alt = image1.alt;
        img1.className = 'project-component-image';
        image1Column.appendChild(img1);

        const caption1Div = document.createElement('div');
        caption1Div.classList.add("caption", "in-large-grid", "left");
        caption1Div.textContent = caption1.replace(/\s(?=[^\s]*$)/, '\u00A0');

        const image2Column = document.createElement('div');
        image2Column.classList.add("project-component-image-area", "right");
        const img2 = document.createElement('img');
        img2.src = image2.filename;
        img2.loading = 'lazy';
        img2.alt = image2.alt;
        img2.className = 'project-component-image';
        image2Column.appendChild(img2);

        const caption2Div = document.createElement('div');
        caption2Div.classList.add("caption", "in-large-grid", "right");
        caption2Div.textContent = caption2.replace(/\s(?=[^\s]*$)/, '\u00A0');

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
        captionDiv.textContent = caption.replace(/\s(?=[^\s]*$)/, '\u00A0');

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

            textColumn.appendChild(paragraph);
        }
        else {
            body.content.forEach(bodyItem => {
                const paragraph = document.createElement('p');
                paragraph.className = 'project-component-paragraph';

                if (!bodyItem.content) {
                    return;
                }
    
                bodyItem.content.forEach(richTextItem => {
                    let text = richTextItem.text.replace(/\s(?=[^\s]*$)/, '\u00A0');
                    
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

class VideoEmbed {
    static generate(content) {
        const { video, loop, autoplay, muted } = content;

        const videoComponent = document.createElement('div');
        videoComponent.className = 'project-component';

        const videoContainer = document.createElement('div');
        videoContainer.className = "full-width-video-container";

        const videoElement = document.createElement('video');
        videoElement.className = 'project-component-video';
        if (loop) videoElement.setAttribute('loop', '');
        if (autoplay) videoElement.setAttribute('autoplay', '');
        if (muted) videoElement.setAttribute('muted', '');
        videoElement.setAttribute('controls', '');
        videoElement.setAttribute('playsinline', '');
        videoElement.innerHTML = `<source src="${video.filename}" type="video/mp4">`;
        videoContainer.appendChild(videoElement);

        videoComponent.appendChild(videoContainer);

        return videoComponent;
    }
}

class FigmaEmbed {
    static generate(content) {
        const { embedCode } = content;

        const modifiedEmbedCode = embedCode.replace(/style=['"][^'"]*['"]/, '').replace(/width=['"][^'"]*['"]/, 'width="100%"').replace(/height=['"][^'"]*['"]/, 'height="100%"');
        const embedSrc = embedCode.match(/src=['"]([^'"]+)['"]/)?.[1] || null;
        const isPrototype = /https%3A%2F%2Fwww\.figma\.com%2Fproto\//.test(embedSrc || '');

        const figmaComponent = document.createElement('div');
        figmaComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        gridContainer.className = "full-width-figma-grid";
        figmaComponent.appendChild(gridContainer);

        const gridArea = document.createElement('div');
        gridArea.className = "full-width-figma-embed-area";
        gridContainer.appendChild(gridArea);

        const embedContainer = document.createElement('div');
        embedContainer.className = "figma-embed-container";
        gridArea.appendChild(embedContainer);

        embedContainer.innerHTML = modifiedEmbedCode;

        const mobileFigmaEmbed = document.createElement('div');
        mobileFigmaEmbed.className = "mobile-figma-embed";
        figmaComponent.appendChild(mobileFigmaEmbed);

        const mobileCTALink = document.createElement('a');
        mobileCTALink.className = 'cta-link';
        mobileCTALink.href = embedSrc;
        mobileCTALink.target = "_blank";
        mobileFigmaEmbed.appendChild(mobileCTALink);

        const mobileCTALinkText = document.createElement('div');
        mobileCTALinkText.className = "cta-link-text";
        mobileCTALinkText.textContent = isPrototype ? "Open Figma Prototype" : "Open in Figma";
        mobileCTALink.appendChild(mobileCTALinkText);

        return figmaComponent;
    }
}

class RegularHeading {
    static generate(content) {
        const { alignment, text } = content;

        const regularHeadingComponent = document.createElement('div');
        regularHeadingComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        gridContainer.className = (alignment == "right") ? "text-right-grid" : (alignment == "center") ? "text-center-grid" : "text-left-grid";
        regularHeadingComponent.appendChild(gridContainer);

        const textColumn = document.createElement('div');
        textColumn.className = 'project-component-text-area';
        gridContainer.appendChild(textColumn);

        const headingElement = document.createElement('h3');
        headingElement.textContent = text.replace(/\s(?=[^\s]*$)/, '\u00A0');
        textColumn.appendChild(headingElement);

        return regularHeadingComponent;
    }
}

class SmallHeading {
    static generate(content) {
        const { alignment, text } = content;

        const largeHeadingComponent = document.createElement('div');
        largeHeadingComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        largeHeadingComponent.appendChild(gridContainer);

        gridContainer.className = (alignment == "right") ? "text-right-grid" : (alignment == "center") ? "text-center-grid" : "text-left-grid";

        const textColumn = document.createElement('div');
        textColumn.className = 'project-component-text-area';
        gridContainer.appendChild(textColumn);

        const subheadingElement = document.createElement('h4');
        subheadingElement.textContent = text.replace(/\s(?=[^\s]*$)/, '\u00A0');
        textColumn.appendChild(subheadingElement);

        return largeHeadingComponent;
    }
}

class Paragraph {
    static generate(content) {
        const { alignment, text } = content;

        const paragraphComponent = document.createElement('div');
        paragraphComponent.className = 'project-component';

        const gridContainer = document.createElement('div');
        gridContainer.className = (alignment == "right") ? "text-right-grid" : (alignment == "center") ? "text-center-grid" : "text-left-grid";
        paragraphComponent.appendChild(gridContainer);

        const textColumn = document.createElement('div');
        textColumn.className = 'project-component-text-area';
        gridContainer.appendChild(textColumn);

        if (typeof text == 'string') {
            const paragraph = document.createElement('p');
            paragraph.className = 'project-component-paragraph';
            paragraph.innerText = text;
            
            textColumn.appendChild(paragraph);
        }
        else {
            text.content.forEach(bodyItem => {
                const paragraph = document.createElement('p');
                paragraph.className = 'project-component-paragraph';

                if (!bodyItem.content) {
                    return;
                }
    
                bodyItem.content.forEach(richTextItem => {
                    let textContent = richTextItem.text.replace(/\s(?=[^\s]*$)/, '\u00A0');
                    
                    if (richTextItem.marks) {
                        richTextItem.marks.forEach(mark => {
                            if (mark.type === 'link') {
                                textContent = `<a href="${mark.attrs.href}" target="_blank">${textContent}</a>`;
                            }
                            else if (mark.type === 'italic') {
                                textContent = `<i>${textContent}</i>`;
                            }
                        });
                    }
                    
                    paragraph.innerHTML += textContent;
                });
    
                textColumn.appendChild(paragraph);
            });
        }

        return paragraphComponent;
    }
}

class DividerLine {
    static generate(content) {
        const dividerComponent = document.createElement('div');
        dividerComponent.className = 'project-component';

        const dividerLine = document.createElement('div');
        dividerLine.className = 'divider';
        dividerComponent.appendChild(dividerLine);

        return dividerComponent;
    }
}

class ProjectInfo {
    static generate(content) {
        const {
            name,
            projectDescription,
            designers,
            designDisciplines,
            createdFor,
            yearCreated,
            tools,
            projectLength,
            projectLink,
            mainImage
        } = content;

        const projectInfoContainer = document.createElement('div');
        projectInfoContainer.className = 'story-info-container w-container';

        // Project Title
        const projectTitle = document.createElement('h1');
        projectTitle.className = 'project-title';
        projectTitle.textContent = name.replace(/\s(?=[^\s]*$)/, '\u00A0');
        projectInfoContainer.appendChild(projectTitle);

        // Grid for project description and attributes
        const grid = document.createElement('div');
        grid.className = 'story-info-grid';
        projectInfoContainer.appendChild(grid);

        // Project Description
        const descriptionComponent = document.createElement('div');
        descriptionComponent.className = 'story-description-component';
        grid.appendChild(descriptionComponent);

        const descriptionHeading = document.createElement('h5');
        descriptionHeading.textContent = 'Description';
        descriptionComponent.appendChild(descriptionHeading);

        const descriptionText = document.createElement('p');
        descriptionText.className = 'small-paragraph';
        descriptionText.textContent = projectDescription.replace(/\s(?=[^\s]*$)/, '\u00A0');
        descriptionComponent.appendChild(descriptionText);

        // Tags
        const tagsContainerContainer = document.createElement('div');
        tagsContainerContainer.className = 'story-tags-container';
        descriptionComponent.appendChild(tagsContainerContainer);
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'specialty-tags-flex-component';
        tagsContainerContainer.appendChild(tagsContainer);

        designDisciplines.forEach(tag => {
            const tagElement = document.createElement('a');
            tagElement.className = 'specialty-tag';
            tagElement.href = `/projects?filter=${tag.toLowerCase().replace(/[\s\/]/g, '-')}`;
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        // Project Description
        const projectInfoGridColumn = document.createElement('div');
        projectInfoGridColumn.className = 'story-info-grid-column';
        grid.appendChild(projectInfoGridColumn);

        const projectLinkExists = projectLink && projectLink["cached_url"] && projectLink["cached_url"].trim() !== "";
        
        // Attributes
        for (let i = 0; i < 5; i++) {
            const attributeComponent = document.createElement('div');
            attributeComponent.className = 'story-info-component story-info-component-area-' + (i + 1);
        
            const attributeHeading = document.createElement('h5');
        
            const attributeValue = document.createElement('div');
            attributeValue.className = 'small-paragraph';

            if (i == 0) {
                attributeHeading.innerHTML = designers.length == 1 ? "Designer" : "Designers";
                attributeValue.innerHTML = designers.map(s => `<a href="/graduates/${s.toLowerCase().replace(/ /g, '-')}">${s.replace(/ /g, '\u00A0')}</a>`).join(', ');
            }
            else if (i == 1) {
                attributeHeading.innerHTML = "Created For";
                attributeValue.innerHTML = `${createdFor}, ${yearCreated}`;
            }
            else if (i == (projectLinkExists ? 2 : 3)) {
                attributeHeading.innerHTML = "Tools Used";
                attributeValue.innerHTML = tools.map((s, i) => i ? s.replace(/ /g, '\u00A0') : s).join(', ');
            }
            else if (i == (projectLinkExists ? 3 : 4)) {
                attributeHeading.innerHTML = "Project Length";
                attributeValue.innerHTML = projectLength;
            }
            else if (i == 4 && projectLinkExists) {
                attributeHeading.innerHTML = "Project Link";

                let linkURL = "";
                let linkText = "";
                if (projectLink.linktype == "story") {
                    linkURL = "/" + projectLink["cached_url"];
                    linkText = "Link";
                }
                else {
                    linkURL = (projectLink["cached_url"].startsWith("http") ? "" : "https://") + projectLink["cached_url"];
                    linkText = "Link";
                }

                attributeValue.innerHTML = `<a href="${linkURL}" target="_blank">${linkText}</a>`;
            }
            else {
                continue;
            }
            
            attributeComponent.appendChild(attributeHeading);
            attributeComponent.appendChild(attributeValue);

            projectInfoGridColumn.appendChild(attributeComponent);
        }

        // Project Hero
        const heroContainer = document.createElement('div');
        heroContainer.className = 'project-hero-container';
        projectInfoContainer.appendChild(heroContainer);

        const img = document.createElement('img');
        img.src = mainImage.filename;
        img.alt = mainImage.alt;
        img.className = 'project-hero';
        heroContainer.appendChild(img);

        return projectInfoContainer;
    }
}


const components = {
    "regular_heading": RegularHeading,
    "small_heading": SmallHeading,
    "paragraph": Paragraph,
    "single_image": SingleImage,
    "two_images": TwoImages,
    "image_and_text": ImageAndText,
    "video_embed": VideoEmbed,
    "figma_embed": FigmaEmbed,
    "divider_line": DividerLine
    // Add more components here
};

/* ~~~~~~~~~~ Page Builder ~~~~~~~~~~ */

const storyblokInstance = new window.StoryblokBridge();
storyblokInstance.on(['published', 'change'], () => location.reload(true));

async function fetchDataAndRender(version) {
    const editing = await isInEditor();

    fetch(`https://api-us.storyblok.com/v2/cdn/stories/projects/${window.location.pathname.split('/').filter(Boolean).pop()}?token=1bXsfgDSA3eGrDuGxB3coAtt&version=${editing ? "draft" : "published"}`)
    .then(response => response.json())
    .then(data => {        
        document.getElementById("project-info-section").appendChild(ProjectInfo.generate({
            ...data.story.content,
            name: data.story.name,
        }));

        const rootElement = document.getElementById("project-components");

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