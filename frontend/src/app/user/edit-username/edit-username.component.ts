import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { validateUsername } from '../../auth/custom-username-validators';
import { UserService } from '../user.service';

@Component({
    selector: 'app-edit-username',
    templateUrl: './edit-username.component.html',
    styleUrl: './edit-username.component.css'
})
export class EditUsernameComponent implements OnInit {
    userId = this.authService.getCurrentUserId();
    username = this.authService.getCurrentUsername();
    editUsernameForm: FormGroup;
    error!: string;
    editLoading = false;

    disabled = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private route: ActivatedRoute
    ) {
        this.editUsernameForm = this.fb.group({
            username: ['',
                [Validators.required,
                    validateUsername,
                Validators.minLength(3)]],
        });
    }

    ngOnInit(): void {
        this.checkIsCurrentUser();
    }

    checkIsCurrentUser() {
        this.route.params.subscribe(params => {
            if (params['username'] !== this.username) {
                this.router.navigate(['/']);
            }
        })
    }

    onSubmit() {
        if (this.editUsernameForm.invalid) {
            return;
        }
        this.error = '';
        
        let newUsername = this.editUsernameForm.value.username;
        newUsername = newUsername.toLowerCase();

        const refreshToken = this.authService.getCookie(this.authService.refreshTokenKey);
        this.userService.editUsername(this.userId, newUsername, refreshToken)
            .subscribe((response) => {
                this.editLoading = true;
                this.disabled = true;

                const { access, refresh } = response;
                this.authService.saveTokens({ access, refresh });

                setTimeout(() => {
                    this.router.navigate(['/profile', newUsername]);
                }, 3000);

            }, (error) => {
                this.editLoading = false;
                this.disabled = false;
                this.error = error.error.username;
                console.log(error);
            })
    }

}
