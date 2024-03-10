import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import sha256 from 'sha256'; 
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(6)]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
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
    const username = this.form.value.username;
    const hashedPassword = sha256(this.form.value.password);
    
    const formData = {
      username,
      password: hashedPassword,
    };
    
    this.authService.register(formData)
      .subscribe((response) => {
        this.authenticationService.setCurrentUser(response);
        this.router.navigate(['']);
      },
        (error) => {
          console.log("Error", error);
          this.error = error.error.username;
        }
      );

  }
}
