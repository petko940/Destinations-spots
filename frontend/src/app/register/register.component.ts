import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;

  error : string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(6)]],
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
    this.http.post('http://127.0.0.1:8000/api/register/', this.form.value).subscribe(
      (response) => {
        console.log("Success!", response),
        this.router.navigate(['']);
      },
      (error) => {
        console.log("Error", error);
        this.error = error.error.username;
        console.log(this.error);
        
      }

    );
    
  }
}
