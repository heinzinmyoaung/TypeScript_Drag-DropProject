import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind-decorator.js';
import { projectState } from '../state/project-state.js';
import { Project, ProjectStatus } from '../models/project.js';
import { SingleProject } from './project-item.js';
import { DragTarget } from '../models/drap-drop.js';


//// ProjectList templete section to move in Div'app' and assign Div 'id' 
export class ProjectList extends Component <HTMLDivElement, HTMLElement> implements DragTarget {

    assignedProjects: Project[] =[]
    constructor(private type: 'active' | 'finished'){

        super('project-list','app',`${type}-list`, true);

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        if(event.dataTransfer &&  event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault()
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable')
        }
        
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable')
    }

    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveFinished(
            prjId,
            this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
        )
        // console.log(prjId)


    }

    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)



        projectState.addListener((projects: Project[])=>{
            const filterActiveProjects = projects.filter(prj=>{
                if(this.type === 'active'){
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = filterActiveProjects
            this.renderProjects()
        })
    }

    renderContent(){
        const listId = `${this.type}-project-list`
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent= this.type.toUpperCase() + 'Projects';

    }
    

    private renderProjects(){

        const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement
        listEl.innerHTML=''
        for (const prjItem of this.assignedProjects) {

            // new SingleProject(`${this.type}-project-list`,prjItem)  //same
            new SingleProject(this.element.querySelector('ul')!.id,prjItem) // same
            }
    }

}

