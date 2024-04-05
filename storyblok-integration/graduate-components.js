/* ~~~~~~~~~~ Components ~~~~~~~~~~ */

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
            tagElement.href = '#';
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
                attributeValue.innerHTML = designers.map((s, i) => i ? s.replace(/ /g, '\u00A0') : s).join(', ');
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