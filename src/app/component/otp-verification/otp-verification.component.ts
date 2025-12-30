import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OtpVerificationComponent implements OnInit {
  otpVerifyForm!: FormGroup;
  email: string = '';
  countdown = 60;
  timer: any;
  justSent = false;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.otpVerifyForm = this.fb.group({
      otp: '',
    });
    this.email = this.route.snapshot.paramMap.get('email') || '';
    // this.startCountdown();
  }

  verify() {
    this.submitted = true;
    if (this.otpVerifyForm.invalid) {
      return;
    }
    this.authService
      .verifyOTP(this.email, this.otpVerifyForm.get('otp')?.value)
      .subscribe(
        (response) => {
          // If login successful, navigate to page verify OTP
          if (response && response.code && response.code === 'TD-000') {
            //TODO: show popup success
            this.router.navigate(['/sign-in']);
          }
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
  }

  // startCountdown(): void {
  //   this.countdown = 60;
  //   this.justSent = false;

  //   if (this.timer) {
  //     clearInterval(this.timer);
  //   }

  //   this.timer = setInterval(() => {
  //     this.countdown--;

  //     if (this.countdown <= 0) {
  //       clearInterval(this.timer);
  //       this.timer = null;
  //     }
  //   }, 1000);
  // }

  resendOtp(): void {
    //Call resend OTP API here
    this.authService.reSendOTP(this.email).subscribe(
      (response) => {
        // If login successful, navigate to page verify OTP
        if (response && response.code && response.code === 'TD-000') {
          this.justSent = true;
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );

    // this.startCountdown();
  }

  // ngOnDestroy(): void {
  //   if (this.timer) {
  //     clearInterval(this.timer);
  //   }
  // }
}
