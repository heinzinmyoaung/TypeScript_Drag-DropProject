var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './base-component.js';
import { validate } from '../util/validation.js';
import { autobind } from '../decorators/autobind-decorator.js';
import { projectState } from '../state/project-state.js';
export class ProjectInput extends Component {
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
//# sourceMappingURL=project-input.js.map