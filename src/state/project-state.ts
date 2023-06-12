import { Project, ProjectStatus } from '../models/project.js';



// type Listener = (itmes: Project[]) => void
export type Listener<T> = (itmes: T[]) => void
    
export class State<T>{
    protected listeners: Listener<T>[] =[]
    
    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn)
    }

}

export class ProjectState extends State<Project>{
    private projectArr:Project[] = []
    private static instance: ProjectState;

    private constructor(){
        super();
    }

    static getInstance(){
        if(this.instance){
            // console.log(this.instance)
            return this.instance
        }
        this.instance = new ProjectState()
    
        return this.instance 
    }

    arrAddProjectListFn(title: string, description: string, numOfPeople: number){
        const newProject = new Project(Math.random().toString(),title,description,numOfPeople,ProjectStatus.Active)
        this.projectArr.push(newProject)

        this.updateListeners()

    }

    moveFinished(prjId: string, newStatus: ProjectStatus){
        const project = this.projectArr.find(prj => prj.id === prjId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {

        for (const listenerFn of this.listeners) {
            listenerFn(this.projectArr.slice());
            // console.log(listenerFn)

        }
    }




}

export const projectState = ProjectState.getInstance()
