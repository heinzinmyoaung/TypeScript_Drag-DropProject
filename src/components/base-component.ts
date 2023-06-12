    //Base Component
export abstract class Component<T extends HTMLElement,U extends HTMLElement>{
    templetaElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor(templeteId: string, hostElementId: string,elementId: string, insertAdjacentPosition: boolean){
        this.templetaElement = document.getElementById(templeteId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T

        const importedNode = document.importNode(this.templetaElement.content, true)
        this.element = importedNode.firstElementChild as U
        this.element.id = elementId

        this.attach(insertAdjacentPosition)
    }
    private attach(position: boolean){
        this.hostElement.insertAdjacentElement(position ? 'beforeend' : 'afterbegin', this.element)
    }

    abstract configure():void
    abstract renderContent():void
}

