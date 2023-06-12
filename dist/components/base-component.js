export class Component {
    constructor(templeteId, hostElementId, elementId, insertAdjacentPosition) {
        this.templetaElement = document.getElementById(templeteId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templetaElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = elementId;
        this.attach(insertAdjacentPosition);
    }
    attach(position) {
        this.hostElement.insertAdjacentElement(position ? 'beforeend' : 'afterbegin', this.element);
    }
}
//# sourceMappingURL=base-component.js.map