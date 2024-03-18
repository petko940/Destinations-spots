import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { validateUsername } from '../custom-username-validators';
import sha256 from 'sha256';

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
                    validateUsername,
                Validators.minLength(3)]],
            password: ['',
                [Validators.required,
                Validators.minLength(6)]],
            confirmPassword: ['',
                Validators.required]
        }, { validators: this.passwordMatchValidator }
        );
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
