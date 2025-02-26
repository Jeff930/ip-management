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
import { CommonModule } from '@angular/common';

export interface IpDialogData {
  mode: 'add' | 'edit' | 'view';
  ipData?: any;
}

@Component({
  selector: 'app-ip-dialog',
  templateUrl: './ip-dialog.component.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, FormsModule, MatInputModule,
    ReactiveFormsModule, CommonModule],
  styleUrls: ['./ip-dialog.component.scss']
})
export class IpDialogComponent {
  ipForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean = false;
  isViewMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IpDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.isViewMode = data.mode === 'view';
    this.dialogTitle = data.mode === 'add' ? 'Add IP Address' : data.mode === 'edit' ? 'Edit IP Address' : 'View IP Address';

    this.ipForm = this.fb.group({
      ip_address: [data.ipData?.ip_address || '', [Validators.required]],
      label: [data.ipData?.label || ''],
      comment: [data.ipData?.comment || '']
    });

    if (this.isViewMode) {
      this.ipForm.disable(); 
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.ipForm.valid) {
      this.dialogRef.close(this.ipForm.value);
    }
  }
}
