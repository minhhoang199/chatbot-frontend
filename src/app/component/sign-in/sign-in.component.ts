import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SignInResponse } from '../../model/sign-in-response';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: '',
      password: ''
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
