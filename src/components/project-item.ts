import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind-decorator.js';
import { Project } from '../models/project.js';
import { Draggable } from '../models/drap-drop.js';



export class SingleProject extends Component<HTMLUListElement,HTMLLIElement> implements Draggable {

    get persons() {
        if(this.project.people === 1){
            return '1 person'
        }else{
            return `${this.project.people} persons`
        }
    }

    constructor(hostId: string,private project: Project){
        super('single-project',hostId,project.id, true)

            this.configure();
            this.renderContent();
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('p')!.textContent = this.project.description;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';

    }

    // draggableStartHandler(event: DragEvent) {
    //     console.log(event)
    // }
    @autobind
    dragStartHandler(event: DragEvent ): void {
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed = "move"
        // console.log(event)

    }

    dragEndHandler(_: DragEvent): void {
        console.log("end")
    }

    
}
