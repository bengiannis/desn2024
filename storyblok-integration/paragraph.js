/*

Component: Paragraph
Developers: Ben

*/

export class Paragraph {
    static generate(content) {
        const { Text } = content;

        const paragraph = document.createElement("p");
        paragraph.textContent = Text;

        return paragraph;
    }
}