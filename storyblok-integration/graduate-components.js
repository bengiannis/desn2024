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

class GraduateInfo {
    static generate(content) {
        const {
            name,
            pronouns,
            workPreferences,
            biography,
            designDisciplines,
            portfolioWebsite,
            email,
            twitter,
            instagram,
            linkedin,
            other,
            question1,
            question2,
            question3,
            answer1,
            answer2,
            answer3,
        } = content;

        const projectInfoContainer = document.createElement('div');
        projectInfoContainer.className = 'story-info-container w-container';

        // Grid for project description and attributes
        const grid = document.createElement('div');
        grid.className = 'story-info-grid';
        projectInfoContainer.appendChild(grid);

        // Project Description
        const descriptionComponent = document.createElement('div');
        descriptionComponent.className = 'story-description-component';
        grid.appendChild(descriptionComponent);

        const descriptionHeading = document.createElement('h5');
        descriptionHeading.textContent = 'Biography';
        descriptionComponent.appendChild(descriptionHeading);

        const descriptionText = document.createElement('p');
        descriptionText.className = 'small-paragraph';
        descriptionText.textContent = biography.replace(/\s(?=[^\s]*$)/, '\u00A0');
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
            tagElement.href = `/graduates?filter=${tag.toLowerCase().replace(/[\s\/]/g, '-')}`;
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        // Project Description
        const projectInfoGridColumn = document.createElement('div');
        projectInfoGridColumn.className = 'story-info-grid-column';
        grid.appendChild(projectInfoGridColumn);
        
        // Attributes
        for (let i = 0; i < 6; i++) {
            const attributeComponent = document.createElement('div');
            attributeComponent.className = 'story-info-component story-info-component-area-' + (i + 1);
        
            const attributeHeading = document.createElement('h5');
        
            const attributeValue = document.createElement('div');
            attributeValue.className = 'small-paragraph';

            if (i == 0) {
                attributeHeading.innerHTML = "Portfolio";

                    let linkURL = "";
                    let linkText = "";
                    if (portfolioWebsite.linktype == "url") {
                        linkURL = (portfolioWebsite["cached_url"].startsWith("http") ? "" : "https://") + portfolioWebsite["cached_url"];
                        linkText = extractDomain(portfolioWebsite["cached_url"]);
                    }

                    attributeValue.innerHTML = `<a href="${linkURL}" target="_blank">${linkText}</a>`;
            }
            else if (i == 1) {
                attributeHeading.innerHTML = "Email";
                attributeValue.innerHTML = `<a href="mailto:${email}" target="_blank">${email}</a>`;
            }
            else if (i == 2) {
                let links = [];
                if (twitter && twitter["cached_url"]) {
                    links.push(createLinkHTML(twitter["cached_url"]));
                }
                if (instagram && instagram["cached_url"]) {
                    links.push(createLinkHTML(instagram["cached_url"]));
                }
                if (linkedin && linkedin["cached_url"]) {
                    links.push(createLinkHTML(linkedin["cached_url"]));
                }
                if (other && other["cached_url"]) {
                    links.push(createLinkHTML(other["cached_url"]));
                }

                attributeHeading.innerHTML = links.length ? "Social" : "";
                attributeValue.innerHTML = links.join(', ');
            }
            else if (i == 3) {
                attributeHeading.innerHTML = question1.replace(/\s(?=[^\s]*$)/, '\u00A0');;
                attributeValue.innerHTML = answer1.replace(/\s(?=[^\s]*$)/, '\u00A0');;
            }
            else if (i == 4) {
                attributeHeading.innerHTML = question2.replace(/\s(?=[^\s]*$)/, '\u00A0');;
                attributeValue.innerHTML = answer2.replace(/\s(?=[^\s]*$)/, '\u00A0');;
            }
            else if (i == 5) {
                attributeHeading.innerHTML = question3.replace(/\s(?=[^\s]*$)/, '\u00A0');;
                attributeValue.innerHTML = answer3.replace(/\s(?=[^\s]*$)/, '\u00A0');;
            }
            
            attributeComponent.appendChild(attributeHeading);
            attributeComponent.appendChild(attributeValue);

            projectInfoGridColumn.appendChild(attributeComponent);
        }

        return projectInfoContainer;
    }
}

class ProjectCell {
    static generate(content) {
        const {
            name,
            slug,
            thumbnailImage,
            designDisciplines,
        } = content;

        const anchor = document.createElement('a');
        anchor.href = `/projects/${slug}`;
        anchor.classList.add('projects-cell');
      
        const img = document.createElement('img');
        img.src = thumbnailImage.filename;
        img.classList.add('projects-cell-image');
        anchor.appendChild(img);
      
        const divName = document.createElement('div');
        divName.textContent = name;
        divName.classList.add('project-cell-name');
        anchor.appendChild(divName);
      
        const divSlug = document.createElement('div');
        divSlug.textContent = "placeholder";
        divSlug.classList.add('project-cell-slug');
        anchor.appendChild(divSlug);
      
        const divDisciplines = document.createElement('div');
        divDisciplines.classList.add('project-cell-disciplines');
        divDisciplines.textContent = designDisciplines.join(", ");
        anchor.appendChild(divDisciplines);
      
        const divSubtitle = document.createElement('div');
        divSubtitle.textContent = "placeholder";
        divSubtitle.classList.add('project-cell-subtitle');
        anchor.appendChild(divSubtitle);
      
        return anchor;
      }
}

function createLinkHTML(url) {
    let linkURL = (url.startsWith("http") ? "" : "https://") + url;
    let domainMap = {
        "instagram.com": "Instagram",
        "twitter.com": "X / Twitter",
        "x.com": "X / Twitter",
        "threads.net": "Threads",
        "linkedin.com": "LinkedIn",
        "dribbble.com": "Dribbble",
        "behance.net": "Behance",
        "medium.com": "Medium",
        "youtube.com": "YouTube",
        "tiktok.com": "TikTok",
        "reddit.com": "Reddit",
        "facebook.com": "Facebook",
        "bento.me": "Bento.me",
        "linktr.ee": "Linktree",
        "read.cv": "Read.cv",
        "discord.com": "Discord",
        "discord.gg": "Discord"
    };
    let domain = extractDomain(url)
    let linkText = domainMap[domain] || domain; // Use the domain name as the fallback
    return `<a href="${linkURL}" target="_blank">${linkText}</a>`;
}

function extractDomain(url) {
    const hostname = new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`).hostname;
    const parts = hostname.split('.').reverse();

    if (parts.length >= 2) {
        let domain = `${parts[1]}.${parts[0]}`;
        if (parts.length > 2) {
            // Join all parts except the 'www' and the TLD
            const subdomainParts = parts.slice(2).reverse().filter(part => part !== 'www');
            if (subdomainParts.length) {
                domain = `${subdomainParts.join('.')}.${domain}`;
            }
        }
        return domain;
    }
    return hostname;
}

/*
function extractDomain(url) {
    const hostname = new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`).hostname;
    const parts = hostname.split('.').reverse();
    if (parts.length > 2 && parts[1].length > 2) {
      return `${parts[1]}.${parts[0]}`;
    }
    return hostname;
}*/

const components = {
    "divider_line": DividerLine
    // Add more components here
};

/* ~~~~~~~~~~ Page Builder ~~~~~~~~~~ */

const storyblokInstance = new window.StoryblokBridge();
storyblokInstance.on(['published', 'change'], () => location.reload(true));

async function fetchDataAndRender(version) {
    const editing = await isInEditor();

    fetch(`https://api-us.storyblok.com/v2/cdn/stories/graduates/${window.location.pathname.split('/').filter(Boolean).pop()}?token=1bXsfgDSA3eGrDuGxB3coAtt&version=${editing ? "draft" : "published"}`)
    .then(response => response.json())
    .then(data => {        
        document.getElementById("graduate-info-section").appendChild(GraduateInfo.generate({
            ...data.story.content,
            name: data.story.name,
        }));

        document.getElementById("short-title").textContent = data.story.content.shortTitle;

        let workStatus = "Open to ";
        if (data.story.content.workPreferences.includes("Freelance")) {
            workStatus += data.story.content.workPreferences.join(", ").replace(/, ([^,]*)$/, ', and $1') + " work";
        } else {
            workStatus += data.story.content.workPreferences.join(" and ") + " positions";
        }
        document.getElementById("work-status").textContent = workStatus;

        document.getElementById("pronouns").textContent = data.story.content.pronouns;

        const fetchPromises = [];

        for (const projectUUID of data.story.content.projects) {
            const url = `https://api-us.storyblok.com/v2/cdn/stories/${projectUUID}?find_by=uuid&token=1bXsfgDSA3eGrDuGxB3coAtt&version=${editing ? "draft" : "published"}`;
            fetchPromises.push(fetch(url).then(response => response.json()));
        }

        Promise.all(fetchPromises)
            .then(results => {
                // Now that all the fetches are completed, append the projects in order.
                results.forEach(data => {
                    document.getElementById("graduate-projects-grid").appendChild(ProjectCell.generate({
                        ...data.story.content,
                        name: data.story.name,
                        slug: data.story.slug
                    }));
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
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