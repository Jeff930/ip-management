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

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const NAMES: string[] = [
  'Jefferson de Guzman',
  'Sophia Williams',
  'Daniel Martinez',
  'Emily Johnson',
  'Michael Brown',
  'Olivia Davis',
  'Ethan Garcia',
  'Emma Wilson',
  'Liam Smith',
  'Ava Miller',
];

const EMAILS: string[] = [
  'jefferson@example.com',
  'sophia@example.com',
  'daniel@example.com',
  'emily@example.com',
  'michael@example.com',
  'olivia@example.com',
  'ethan@example.com',
  'emma@example.com',
  'liam@example.com',
  'ava@example.com',
];

const ROLES: string[] = ['Admin', 'Editor', 'User', 'Manager', 'Guest'];

function randomDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function createNewUserEntry(id: number): UserData {
  return {
    id: id.toString(),
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    email: EMAILS[Math.floor(Math.random() * EMAILS.length)],
    role: ROLES[Math.floor(Math.random() * ROLES.length)],
    createdAt: randomDate(),
  };
}

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
  styleUrl: './list-user.component.scss',
})
export class ListUserComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {
    const userEntries = Array.from({ length: 20 }, (_, k) => createNewUserEntry(k + 1));
    this.dataSource = new MatTableDataSource(userEntries);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addData() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, { id: (this.dataSource.data.length + 1).toString(), ...result }];
      }
    });
  }

  editData(row: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'edit', userData: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(item => item.id === row.id);
        this.dataSource.data[index] = { ...row, ...result };
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }

  viewData(row: any) {
    this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'view', userData: row }
    });
  }

  deleteData(row: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleted User:', row);
    }
  }
}
