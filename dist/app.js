"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
        console.log(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projectArr = [];
    }
    static getInstance() {
        if (this.instance) {
            console.log(this.instance);
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    arrAddProjectListFn(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projectArr.push(newProject);
        this.updateListeners();
    }
    moveFinished(prjId, newStatus) {
        const project = this.projectArr.find(prj => prj.id === prjId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projectArr.slice());
            console.log(listenerFn);
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (typeof validatableInput.value === 'string' && validatableInput.minLength) {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (typeof validatableInput.value === 'string' && validatableInput.maxLength) {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (typeof validatableInput.value === 'number' && validatableInput.min) {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (typeof validatableInput.value === 'number' && validatableInput.max) {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
function autobind(_, _2, descriptors) {
    const originalMethod = descriptors.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const bondfn = originalMethod.bind(this);
            return bondfn;
        }
    };
    return adjDescriptor;
}
class Component {
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
class SingleProject extends Component {
    get persons() {
        if (this.project.people === 1) {
            return '1 person';
        }
        else {
            return `${this.project.people} persons`;
        }
    }
    constructor(hostId, project) {
        super('single-project', hostId, project.id, true);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('p').textContent = this.project.description;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = "move";
        console.log(event);
    }
    dragEndHandler(_) {
        console.log("end");
    }
}
__decorate([
    autobind
], SingleProject.prototype, "dragStartHandler", null);
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', `${type}-list`, true);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dragLeaveHandler(_) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    dropHandler(event) {
        const prjId = event.dataTransfer.getData('text/plain');
        projectState.moveFinished(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
        console.log(prjId);
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects) => {
            const filterActiveProjects = projects.filter(prj => {
                console.log(this.type);
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = filterActiveProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + 'Projects';
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-project-list`);
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new SingleProject(this.element.querySelector('ul').id, prjItem);
        }
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);
class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', 'user-input', false);
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    gatherUserInput() {
        const getTitle = this.titleInputElement.value;
        const getDescription = this.descriptionInputElement.value;
        const getPeople = this.peopleInputElement.value;
        const titleInputElement = {
            value: getTitle,
            required: true
        };
        const descriptionInputElement = {
            value: getDescription,
            required: true,
            minLength: 5
        };
        const peopleInputElement = {
            value: +getPeople,
            required: true,
            min: 1,
            max: 5
        };
        if (!validate(titleInputElement) ||
            !validate(descriptionInputElement) ||
            !validate(peopleInputElement)) {
            alert('ssfsf');
            return;
        }
        else {
            return [getTitle, getDescription, +getPeople];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, descripton, people] = userInput;
            projectState.arrAddProjectListFn(title, descripton, +people);
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const projectPrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
//# sourceMappingURL=app.js.map