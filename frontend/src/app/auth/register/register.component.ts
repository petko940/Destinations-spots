import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import sha256 from 'sha256';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm: FormGroup;
    error: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
    ) {
        this.registerForm = this.fb.group({
            username: ['',
                [Validators.required,
                this.validateUsername,
                Validators.minLength(3)]],
            password: ['',
                [Validators.required,
                Validators.minLength(6)]],
            confirmPassword: ['',
                Validators.required]
        }, { validators: this.passwordMatchValidator }
        );
    }

    validateUsername(control: AbstractControl) {
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

    passwordMatchValidator(g: FormGroup) {
        const password = g.get('password')?.value;
        const confirmPassword = g.get('confirmPassword')?.value;

        if (password && confirmPassword && password !== confirmPassword) {
            return { 'mismatch': true };
        }
        return null;
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            return;
        }

        const username = this.registerForm.value.username;
        const hashedPassword = sha256(this.registerForm.value.password);

        const formData = {
            username,
            password: hashedPassword,
        };

        this.authService.register(formData)
            .subscribe((response) => {
                this.authService.login(formData)
                    .subscribe(() => {
                        this.router.navigate(['']);
                    })
            },
                (error) => {
                    console.log("Error", error);
                    this.error = error.error.username;
                }
            );

    }
}
