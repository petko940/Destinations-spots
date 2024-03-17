import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-username',
    templateUrl: './edit-username.component.html',
    styleUrl: './edit-username.component.css'
})
export class EditUsernameComponent {
    userId = this.authService.getCurrentUserId();
    editUsernameForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private authService: AuthService,
        private router: Router,
    ) {

        this.editUsernameForm = this.fb.group({
            username: [''],
        });
    }

    onSubmit() {
        this.http.put(`http://127.0.0.1:8000/api/user/${this.userId}/change-username/`, this.editUsernameForm.value)
            .subscribe((response) => {
                this.authService.updateTokens(this.editUsernameForm.value.username);
                setTimeout(() => {
                    this.router.navigate(['/profile']);
                }, 1000);
            }, (error) => {
                console.log(error);
            })
    }

}
