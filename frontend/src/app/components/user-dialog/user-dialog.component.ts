import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface UserDialogData {
  mode: 'add' | 'edit' | 'view';
  userData?: any;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, FormsModule, MatInputModule,
    ReactiveFormsModule],
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  userForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean = false;
  isViewMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.isViewMode = data.mode === 'view';
    this.dialogTitle = data.mode === 'add' ? 'Add IP Address' : data.mode === 'edit' ? 'Edit IP Address' : 'View IP Address';

    this.userForm = this.fb.group({
      name: [data.userData?.name || '', [Validators.required]],
      email: [data.userData?.email || ''],
      role: [data.userData?.role || '']
    });

    if (this.isViewMode) {
      this.userForm.disable();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
