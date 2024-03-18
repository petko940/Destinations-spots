import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { validateUsername } from '../../auth/custom-username-validators';

@Component({
    selector: 'app-edit-username',
    templateUrl: './edit-username.component.html',
    styleUrl: './edit-username.component.css'
})
export class EditUsernameComponent {
    userId = this.authService.getCurrentUserId();
    username = this.authService.getCurrentUsername();
    editUsernameForm: FormGroup;
    error!: string;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private authService: AuthService,
        private router: Router,
    ) {
        this.editUsernameForm = this.fb.group({
            username: ['',
                [Validators.required,
                    validateUsername,
                Validators.minLength(3)]],
        });
    }

    onSubmit() {
        if (this.editUsernameForm.invalid) {
            return;
        }

        let newUsername = this.editUsernameForm.value.username;
        newUsername = newUsername.toLowerCase();

        this.http.put(`http://127.0.0.1:8000/api/user/${this.userId}/change-username/`, this.editUsernameForm.value)
            .subscribe((response) => {
                this.authService.updateTokens(newUsername);
                setTimeout(() => {
                    this.router.navigate(['/profile', newUsername]);
                }, 1000);
            }, (error) => {
                console.log(error);
                this.error = error.error.username;
            })
    }

}
