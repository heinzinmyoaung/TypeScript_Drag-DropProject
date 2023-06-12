import { Component } from './base-component.js';
import { Validatable, validate } from '../util/validation.js';
import { autobind } from '../decorators/autobind-decorator.js';
import { projectState } from '../state/project-state.js';


export class ProjectInput extends Component <HTMLDivElement, HTMLElement>{
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
