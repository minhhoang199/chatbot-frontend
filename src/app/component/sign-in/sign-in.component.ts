import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  // encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit {
  @ViewChild('loginText') loginText!: ElementRef;
  @ViewChild('loginForm') loginForm!: ElementRef;
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  submitted = false;
  mode: 'login' | 'signup' = 'login';

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: ''
    });
    this.signUpForm = this.fb.group({
      username: '',
      email: '',
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

//   passwordsMatchValidator(group: AbstractControl) {
//   const p = group.get('password')?.value;
//   const cp = group.get('confirmPassword')?.value;
//   return p === cp ? null : { passwordMismatch: true };
// }

  ngAfterViewInit() {
    const signupBtn = document.querySelector("label.signup");
    const loginBtn = document.querySelector("label.login");
    const signupLink = document.querySelector("form .signup-link a");

    signupBtn?.addEventListener('click', () => {
      this.mode = 'signup';
      this.loginForm.nativeElement.style.marginLeft = "-50%";
      this.loginText.nativeElement.style.marginLeft = "-50%";
    });

    loginBtn?.addEventListener('click', () => {
      this.mode = 'login';
      this.loginForm.nativeElement.style.marginLeft = "0%";
      this.loginText.nativeElement.style.marginLeft = "0%";
    });

    signupLink?.addEventListener('click', (e) => {
      e.preventDefault();
      signupBtn?.dispatchEvent(new Event('click'));
    });
  }

  signIn(){
    this.submitted = true;
    if (this.signInForm.invalid) {
      return;
    }
    this.authService.signIn(this.signInForm.get('email')?.value, this.signInForm.get('password')?.value)
  .subscribe(response => {
    // If login successful, navigate to page2
    if (response && response.data && response.code && response.code === "TD-000") {
      console.log(response.data);
      this.authService.setToken(response);
      this.router.navigate(['/chat']);
    } else {
    }
  }, error => {
    console.error('Error occurred:', error);
  });
  }

  signUp(){
    this.submitted = true;
    if (this.signUpForm.invalid) {
      // this.signUpForm.markAllAsTouched();
      return;
    }
    if (this.signUpForm.get('password')?.value !== this.signUpForm.get('confirmPassword')?.value) {
      console.error('Passwords do not match');
      return;
    }
    this.authService.signUp(
      this.signUpForm.get('username')?.value,
      this.signUpForm.get('email')?.value, 
      this.signUpForm.get('password')?.value, 1)
  .subscribe(response => {
    // If login successful, navigate to page verify OTP
    if (response && response.code && response.code === "TD-000") {
      let email = this.signUpForm.get('email')?.value;
      console.log('Signup successful, navigating to OTP verification for email:', email);
      this.router.navigate(['/verify-otp/' + email]);
    }
  }, error => {
    console.error('Error occurred:', error);
  });
  }

  forgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}
