import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userInfoForm: FormGroup;
  passwordForm: FormGroup;
  userData: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userInfoForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group(
      {
        current_password: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(6)]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.getUser().subscribe({
      next: (response: any) => {
        this.userData = response;
        this.userInfoForm.patchValue({
          name: this.userData.name,
          email: this.userData.email
        });
      },
      error: (err) => console.error('Error fetching user data:', err)
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password')?.value;
    const password_confirmation = control.get('password_confirmation')?.value;
    return password === password_confirmation ? null : { passwordMismatch: true };
  };

  updateUserInfo(): void {
    if (this.userInfoForm.valid) {
      this.authService.updateInfo(this.userInfoForm.value).subscribe({
        next: (response: any) => {
          this.userData = response.user;
        },
        error: (err) => console.error('Error updating user info:', err)
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.authService.changePassword(this.passwordForm.value).subscribe({
        next: (response: any) => {
          console.log('Password updated successfully:', response);
          this.passwordForm.reset();
        },
        error: (err) => console.error('Error updating password:', err)
      });
    }
  }
}
