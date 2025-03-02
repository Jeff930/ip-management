import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { IpDialogComponent } from '../../components/ip-dialog/ip-dialog.component';
import { IpAddressService, IpData } from '../../services/ip-address.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { LoadingService } from '../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list-ip',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    DateFormatPipe
  ],
  templateUrl: './list-ip.component.html',
  styleUrls: ['./list-ip.component.scss']
})
export class ListIpComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['_id', 'ip', 'addedByUserName', 'label', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<IpData> = new MatTableDataSource<IpData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private ipService: IpAddressService, private authService: AuthService, private loadingService: LoadingService,
    private snackBar: MatSnackBar) { }
  canDeleteIP = false;

  ngOnInit(): void {
    this.loadIpAddresses();
    this.checkDeletePermission();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadIpAddresses(): void {
    this.loadingService.show();
    this.ipService.getIpAddresses().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error fetching IPs', err);
        this.loadingService.hide();
        this.snackBar.open('Failed fetching IP Addresses. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addData(): void {
    const dialogRef = this.dialog.open(IpDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.ipService.addIpAddress(result).subscribe({
          next: (newIp) => {
            this.dataSource.data = [...this.dataSource.data, newIp];
            this.loadingService.hide();
            this.snackBar.open('Added IP Address successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => {
            console.error('Error adding IP', err);
            this.loadingService.hide();
            this.snackBar.open('Failed adding IP Address. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }

  editData(row: IpData): void {
    const dialogRef = this.dialog.open(IpDialogComponent, {
      width: '500px',
      data: { mode: 'edit', ipData: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.show();
        this.ipService.updateIpAddress(row._id, result).subscribe({
          next: (updatedIp) => {
            const index = this.dataSource.data.findIndex(item => item._id === row._id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedIp;
              this.dataSource.data = [...this.dataSource.data]; 
            }
            this.loadingService.hide();
            this.snackBar.open('Updated IP Address successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => {
            console.error('Error updating IP', err);
            this.loadingService.hide();
            this.snackBar.open('Failed updating IP Address. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }

  viewData(row: IpData): void {
    this.dialog.open(IpDialogComponent, {
      width: '550px',
      data: { mode: 'view', ipData: row }
    });
  }

  deleteData(row: IpData): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${row.ip}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.loadingService.show();
        this.ipService.deleteIpAddress(row._id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item => item._id !== row._id);
            this.loadingService.hide();
            this.snackBar.open('Deleted IP Address successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => {
            console.error('Error deleting IP', err);
            this.loadingService.hide();
            this.snackBar.open('Failed deleting IP Address. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }

  checkDeletePermission() {
    const permissions = this.authService.getUserPermissions();
    this.canDeleteIP = permissions.includes('delete-ip');
  }
}
