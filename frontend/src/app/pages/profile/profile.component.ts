import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { LoadingService } from '../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, DateFormatPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userInfoForm: FormGroup;
  passwordForm: FormGroup;
  userData: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService, private loadingService: LoadingService,
    private snackBar: MatSnackBar, private route: ActivatedRoute) {

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

    this.route.data.subscribe(data => {
      if (data['profile'].error) {
        this.snackBar.open(data['profile'].message, 'Close', { duration: 3000 });
      } else {
        this.userData = data['profile'];
        this.userInfoForm.patchValue({
          name: this.userData.name,
          email: this.userData.email
        });
      }
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password')?.value;
    const password_confirmation = control.get('password_confirmation')?.value;
    return password === password_confirmation ? null : { passwordMismatch: true };
  };

  updateUserInfo(): void {
    this.loadingService.show();
    if (this.userInfoForm.valid) {
      this.authService.updateInfo(this.userInfoForm.value).subscribe({
        next: (response: any) => {
          this.userData = response;
          this.loadingService.hide();
        },
        error: (err) => {
          console.error('Error updating user info:', err);
          this.loadingService.hide();
          if (err == 'Token refresh failed') {
            this.snackBar.open('Token expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          } else {
            this.snackBar.open('Failed updating user profile.. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        }
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.loadingService.show();
      this.authService.changePassword(this.passwordForm.value).subscribe({
        next: (response: any) => {
          console.log('Password updated successfully:', response);
          this.passwordForm.reset();
          this.loadingService.hide();
        },
        error: (err) => {
          console.error('Error updating password:', err);
          this.loadingService.hide();
          if (err == 'Token refresh failed') {
            this.snackBar.open('Token expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          } else {
            this.snackBar.open('Failed updating password. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        }
      });
    }
  }
}
