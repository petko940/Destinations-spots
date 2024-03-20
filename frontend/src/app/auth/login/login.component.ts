import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import sha256 from 'sha256';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.loginForm = this.fb.group({
            username: [''],
            password: [''],
        });
    }

    onSubmit() {
        if (!this.loginForm.value.username || !this.loginForm.value.password) {
            this.errorMessage = 'Please enter both username and password';
            return;
        }

        const username = this.loginForm.value.username;
        const password = this.loginForm.value.password;

        const hashedPassword = sha256(password);

        const credentials = {
            username: username,
            password: hashedPassword,
        };

        this.authService.login(credentials)
            .subscribe(() => {
                this.router.navigate(['']);
            }, error => {
                console.log(error);
                this.errorMessage = 'Invalid username or password';
            })
    }

}
