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
import { UserDialogComponent } from '../../components/user-dialog/user-dialog.component';
import { UserService, UserData } from '../../services/user.service';

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
    MatButtonModule
  ],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: UserData[]) => {
        this.dataSource.data = users;
      },
      error: (err) => console.error('Error fetching users', err)
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
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: (newUser: UserData) => {
            this.dataSource.data = [...this.dataSource.data, newUser];
          },
          error: (err) => console.error('Error adding user', err)
        });
      }
    });
  }

  editData(row: UserData): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { mode: 'edit', userData: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(row.id, result).subscribe({
          next: (response: any) => {
            const updatedUser: UserData = response.user; // Extract the user from the response
            const index = this.dataSource.data.findIndex(item => item.id === row.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedUser;
              this.dataSource.data = [...this.dataSource.data]; // Refresh table
            }
          },
          error: (err) => console.error('Error updating user', err)
        });
      }
    });
  }

  viewData(row: UserData): void {
    this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { mode: 'view', userData: row }
    });
  }

  deleteData(row: UserData): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(row.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  resetPassword(row: UserData): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { mode: 'editPassword', userData: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.password) {
        this.userService.updatePassword(row.id, result).subscribe({
          next: (response: any) => {
            console.log('Password updated successfully for user:', row.id, response);
          },
          error: (err) => console.error('Error updating password', err)
        });
      }
    });
  }

}
