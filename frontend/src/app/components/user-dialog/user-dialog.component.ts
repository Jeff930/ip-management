import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface UserDialogData {
  mode: 'add' | 'edit' | 'view' | 'editPassword';
  userData?: any;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
  ]
})
export class UserDialogComponent {
  userForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  isEditPasswordMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.isViewMode = data.mode === 'view';
    this.isEditPasswordMode = data.mode === 'editPassword';

    if (data.mode === 'add') {
      this.dialogTitle = 'Add User';
    } else if (data.mode === 'edit') {
      this.dialogTitle = 'Edit User';
    } else if (data.mode === 'editPassword') {
      this.dialogTitle = 'Reset Password';
    } else {
      this.dialogTitle = 'View User';
    }

    if (this.isEditPasswordMode) {
      this.userForm = this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
        },
        { validators: this.passwordMatchValidator }
      );
    } else {
      this.userForm = this.fb.group({
        name: [data.userData?.name || '', [Validators.required]],
        email: [data.userData?.email || '', [Validators.required, Validators.email]],
        role: [data.userData?.role || '', [Validators.required]],
        password: [data.mode === 'add' ? '' : ''],
        password_confirmation: [data.mode === 'add' ? '' : ''],
      });

      if (data.mode === 'add') {
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('password_confirmation')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.setValidators(this.passwordMatchValidator);
      }
    }
    if (this.isViewMode) {
      this.userForm.disable();
    }
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password')?.value;
    const password_confirmation = control.get('password_confirmation')?.value;
    if (password && password_confirmation && password !== password_confirmation) {
      return { passwordMismatch: true };
    }
    return null;
  };

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = { ...this.userForm.value };

      if (!this.isEditPasswordMode && this.isEditMode && !formValue.password) {
        delete formValue.password;
        delete formValue.password_confirmation;
      }
      this.dialogRef.close(formValue);
    }
  }
}
