import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
import { NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css'],
})
export class ProfileSettingComponent implements OnInit {
  loading = true;
  error: string | null = null;
  selectedTab: 'personal' | 'privacy' = 'personal';
  userName: string = '';
  email: string = '';
  changePasswordForm!: FormGroup;
  profileForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    // Initialize user data
    this.userName = this.authService.getUserName() || '';
    this.email = this.authService.getEmail() || '';

    // Initialize forms
    this.profileForm = this.formBuilder.group({
      username: [this.userName, Validators.required]
    });

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']); // Navigate to sign-in page
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
  }

  selectTab(tab: 'personal' | 'privacy'): void {
    this.selectedTab = tab;
  }

  changePassword() {
    if (this.changePasswordForm.get('newPassword')?.value !== this.changePasswordForm.get('confirmPassword')?.value) {
      console.error('Passwords do not match');
      return;
    }
    this.userService.changePassword(this.email, this.changePasswordForm.get('currentPassword')?.value, this.changePasswordForm.get('newPassword')?.value)
      .subscribe({
          next: (res) => {
            if(res === 'TD-000') {
              this.reLogin(this.email, this.changePasswordForm.get('newPassword')?.value);
            }
          }
        });
  }
  
  saveChanges() {
    this.userService.editUserInfo(this.authService.getId(), this.profileForm.get('username')?.value)
      .subscribe({
        next: (res) => {
          if(res === 'TD-000') {
            this.localStorageService.set('username', this.profileForm.get('username')?.value);
            this.userName = this.profileForm.get('username')?.value || '';
          }
        }
      });
  }


  reLogin(email: string, password: string) {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.authService.signIn(email, password)
  .subscribe(response => {
    // If login successful, navigate to page2
    if (response && response.data && response.code && response.code === "TD-000") {
      console.log(response.data);
      this.authService.setToken(response);
    } else {
    }
  }, error => {
    console.error('Error occurred:', error);
  });
  }

  cancel() {
    this.profileForm.patchValue({ username: this.userName });
    this.changePasswordForm.reset();
  }
}
