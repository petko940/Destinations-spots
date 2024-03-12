import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import sha256 from 'sha256'; // Import SHA256 library
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    private username!: string;
    private password!: string;

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

        this.username = this.loginForm.value.username;
        this.password = this.loginForm.value.password;

        const hashedPassword = sha256(this.password);

        const credentials = {
            username: this.username,
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
