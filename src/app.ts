///// Drag & Drop
interface Draggable {
    dragStartHandler(event: DragEvent):void
    dragEndHandler(event: DragEvent): void
}

interface DragTarget {
    dragOverHandler(event: DragEvent):void
    dropHandler(event: DragEvent):void
    dragLeaveHandler(event: DragEvent): void
}

enum ProjectStatus{Active, Finished}
class Project{
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ){
        
    }
}

// type Listener = (itmes: Project[]) => void
type Listener<T> = (itmes: T[]) => void
  
class State<T>{
    protected listeners: Listener<T>[] =[]
    
    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn)
        console.log(listenerFn)
    }

}

class ProjectState extends State<Project>{
    private projectArr:Project[] = []
    private static instance: ProjectState;

    private constructor(){
        super();
    }

    static getInstance(){
        if(this.instance){
            console.log(this.instance)
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
            console.log(listenerFn)

          }
    }

   


}

const projectState = ProjectState.getInstance()



//////Validation 
interface Validatable{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number
}
function validate(validatableInput: Validatable) {
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if(typeof validatableInput.value === 'string' && validatableInput.minLength ){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if(typeof validatableInput.value === 'string' && validatableInput.maxLength ){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    if(typeof validatableInput.value === 'number' && validatableInput.min){
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if(typeof validatableInput.value === 'number' && validatableInput.max){
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    return isValid
}
///////

////AutoBind
function autobind(_: any, _2: string, descriptors: PropertyDescriptor){
    const originalMethod = descriptors.value
    const adjDescriptor: PropertyDescriptor ={
        configurable: true,
        get(){
            const bondfn = originalMethod.bind(this)
            return bondfn
        }
    }
    return adjDescriptor
}
///////

abstract class Component<T extends HTMLElement,U extends HTMLElement>{
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

class SingleProject extends Component<HTMLUListElement,HTMLLIElement> implements Draggable {

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
        console.log(event)

    }

    dragEndHandler(_: DragEvent): void {
        console.log("end")
    }

 
}

//// ProjectList templete section to move in Div'app' and assign Div 'id' 
class ProjectList extends Component <HTMLDivElement, HTMLElement> implements DragTarget {

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
        console.log(prjId)


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


//// ProjectInput Templete to move in  Div 'app' And Get user input and user input Validation
class ProjectInput extends Component <HTMLDivElement, HTMLElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLTextAreaElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input','app','user-input', false);
    
        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLTextAreaElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();

    }

    configure(){
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent(){}
  

    private gatherUserInput(): [string, string, number] | void {
        const getTitle = this.titleInputElement.value
        const getDescription = this.descriptionInputElement.value
        const getPeople = this.peopleInputElement.value

        const titleInputElement: Validatable = {
            value: getTitle,
            required: true
        }
        const descriptionInputElement: Validatable = {
            value: getDescription,
            required: true,
            minLength: 5
        }
        const peopleInputElement: Validatable = {
            value: +getPeople,
            required: true,
            min: 1,
            max: 5
        }
        if(
            !validate(titleInputElement) || 
            !validate(descriptionInputElement) || 
            !validate(peopleInputElement)
        ){
            alert('ssfsf');
            return;
        }
        else{
            return [getTitle, getDescription, +getPeople]

        }
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        
        if(Array.isArray(userInput)){
            const [title,descripton,people] = userInput
            projectState.arrAddProjectListFn(title,descripton,+people)

        }


    }
    
    
}
/////

//////////

const projectInput = new ProjectInput();
const projectPrjList = new ProjectList("active")
const finishedPrjList = new ProjectList("finished")
