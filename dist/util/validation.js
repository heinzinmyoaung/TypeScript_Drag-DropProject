export function validate(validatableInput) {
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
//# sourceMappingURL=validation.js.map