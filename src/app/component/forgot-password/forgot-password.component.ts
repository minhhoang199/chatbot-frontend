import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: '',
      password: '',
      confirmPassword: ''
    });
  }

  forgotPassword(){
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    if (this.forgotPasswordForm.get('password')?.value !== this.forgotPasswordForm.get('confirmPassword')?.value) {
      console.error('Passwords do not match');
      return;
    }
    this.authService.forgotPassword(
    this.forgotPasswordForm.get('email')?.value, 
    this.forgotPasswordForm.get('password')?.value, 1)
  .subscribe(response => {
    // If login successful, navigate to page verify OTP
    if (response && response.code && response.code === "TD-000") {
      let email = this.forgotPasswordForm.get('email')?.value;
      this.router.navigate(['/verify-otp/' + email]);
    }
  }, error => {
    console.error('Error occurred:', error);
  });
  }

  backToSignIn(){
    this.router.navigate(['/sign-in']);
  }
}
