/*

Component: Image Left, Text Right
Developers: Ben

*/

export class ImageLeftTextRight {
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