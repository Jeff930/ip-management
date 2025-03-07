import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../../components/user-dialog/user-dialog.component';
import { UserService, UserData, RoleData } from '../../services/user.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { LoadingService } from '../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-list-user',
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
    DateFormatPipe
  ],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role_name', 'created_at','actions'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>();
  roles: RoleData[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private userService: UserService, private loadingService: LoadingService,
    private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      if (data['users'].error) {
        this.snackBar.open(data['users'].message, 'Close', { duration: 3000 });
      } else {
        this.dataSource.data = data['users'];
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  loadRoles(): Observable<RoleData[]> {
    if (this.roles.length > 0) {
      return of(this.roles);
    }
  
    this.loadingService.show();
    return this.userService.getRoles().pipe(
      tap((roles) => this.roles = roles),
      catchError((err) => {
        console.error('Error loading roles', err);
        this.snackBar.open('Failed fetching roles. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return of([]);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
    
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addData(): void {
    this.loadRoles().subscribe({
      next: (roles) => {
        const dialogRef = this.dialog.open(UserDialogComponent, {
          width: '450px',
          data: { mode: 'add', roles }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadingService.show();
            this.userService.createUser(result).subscribe({
              next: (newUser) => {
                this.dataSource.data.unshift(newUser);
                this.dataSource.data = [...this.dataSource.data];
                this.loadingService.hide();
                this.snackBar.open('Added user successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
              },
              error: (err) => {
                console.error('Error adding user', err);
                this.loadingService.hide();
                this.snackBar.open(
                  err === 'Token refresh failed'
                    ? 'Token expired. Please login again.'
                    : 'Failed adding new user. Please try again.',
                  'Close',
                  { duration: 3000, panelClass: ['error-snackbar'] }
                );
              }
            });
          }
        });
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }
  
  editData(row: UserData): void {
    this.loadRoles().subscribe({
      next: () => {
        const dialogRef = this.dialog.open(UserDialogComponent, {
          width: '450px',
          data: { mode: 'edit', userData: row, roles: this.roles }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadingService.show();
            this.userService.updateUser(row.id, result).subscribe({
              next: (response: any) => {
                const updatedUser: UserData = response.user;
                const index = this.dataSource.data.findIndex(item => item.id === row.id);
                if (index !== -1) {
                  this.dataSource.data[index] = updatedUser;
                  this.dataSource.data = [...this.dataSource.data];
                }
                this.loadingService.hide();
                this.snackBar.open('Updated user successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
              },
              error: (err) => {
                console.error('Error updating user', err);
                this.loadingService.hide();
                if (err == 'Token refresh failed') {
                  this.snackBar.open('Token expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
                } else {
                  this.snackBar.open('Failed updating user. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
                }
              }
            });
          }
        });
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }

  viewData(row: UserData): void {
    this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { mode: 'view', userData: row }
    });
  }

  deleteData(row: UserData): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${row.name}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.loadingService.show();
        this.userService.deleteUser(row.id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
            this.loadingService.hide();
            this.snackBar.open('Deleted user successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => {
            console.error('Error deleting user', err);
            this.loadingService.hide();
            if (err == 'Token refresh failed') {
              this.snackBar.open('Token expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            } else {
              this.snackBar.open('Failed deleting user. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          }
        });
      }
    });
  }

  resetPassword(row: UserData): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { mode: 'editPassword', userData: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.password) {
        this.loadingService.show();
        this.userService.updatePassword(row.id, result).subscribe({
          next: (response: any) => {
            console.log('Password updated successfully for user:', row.id, response);
            this.loadingService.hide();
            this.snackBar.open('Updated password successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => { 
            console.error('Error updating password', err);
            this.loadingService.hide();
            if (err == 'Token refresh failed') {
              this.snackBar.open('Token expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            } else {
              this.snackBar.open('Failed resetting password. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          }
        });
      }
    });
  }

}
