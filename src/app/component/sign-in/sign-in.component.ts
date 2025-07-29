import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SignInResponse } from '../../model/sign-in-response';
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
  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: ''
    });
  }

  ngAfterViewInit() {
    const signupBtn = document.querySelector("label.signup");
    const loginBtn = document.querySelector("label.login");
    const signupLink = document.querySelector("form .signup-link a");

    signupBtn?.addEventListener('click', () => {
      this.loginForm.nativeElement.style.marginLeft = "-50%";
      this.loginText.nativeElement.style.marginLeft = "-50%";
    });

    loginBtn?.addEventListener('click', () => {
      this.loginForm.nativeElement.style.marginLeft = "0%";
      this.loginText.nativeElement.style.marginLeft = "0%";
    });

    signupLink?.addEventListener('click', (e) => {
      e.preventDefault();
      signupBtn?.dispatchEvent(new Event('click'));
    });
  }

  signIn(){
    this.authService.signIn(this.signInForm.get('email')?.value, this.signInForm.get('password')?.value)
  .subscribe(response => {
    // If login successful, navigate to page2
    if (response && response.data && response.code && response.code === "TD-000") {
      console.log(response.data);
      this.authService.setToken(response);
      this.router.navigate(['/chat']);
    } else {
      // this.errorMessage = 'Invalid email or password';
    }
  }, error => {
    console.error('Error occurred:', error);
    // this.errorMessage = 'An error occurred while trying to login. Please try again later.';
  });
  }
}
