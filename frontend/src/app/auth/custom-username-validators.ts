import { AbstractControl } from '@angular/forms';

export function validateUsername(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    if (value.indexOf(' ') >= 0) {
        return { 'noSpace': true };
    }

    if (/^\d/.test(value)) {
        return { 'noStartWithDigit': true };
    }

    if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return { 'alphanumeric': true };
    }

    return null;
}
