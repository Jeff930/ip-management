import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  description: string;
  user: string;
  session: string;
}

const USERS: string[] = [
  'Jefferson',
  'Sophia',
  'Daniel',
  'Emily',
  'Michael',
  'Olivia',
  'Ethan',
  'Emma',
  'Liam',
  'Ava',
];

const ACTIONS: string[] = ['Added', 'Updated', 'Deleted', 'Viewed', 'Login', 'Logout'];

const DESCRIPTIONS: { [key: string]: string } = {
  Added: 'Added a new IP entry',
  Updated: 'Updated an IP entry',
  Deleted: 'Deleted an IP entry',
  Viewed: 'Viewed an IP entry',
  Login: 'User logged in',
  Logout: 'User logged out',
};

function randomTimestamp(): string {
  return new Date(
    new Date().getTime() - Math.floor(Math.random() * 10000000000)
  ).toISOString();
}

function createAuditLogEntry(): AuditLogEntry {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  return {
    timestamp: randomTimestamp(),
    action: action,
    description: DESCRIPTIONS[action],
    user: USERS[Math.floor(Math.random() * USERS.length)],
    session: `Session-${Math.floor(Math.random() * 1000)}`,
  };
}

@Component({
  selector: 'app-audit-log',
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
  ],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
})
export class AuditLogComponent implements AfterViewInit {
  auditLogColumns: string[] = ['timestamp', 'action', 'description', 'user', 'session'];
  auditLogDataSource: MatTableDataSource<AuditLogEntry>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    const auditLogEntries = Array.from({ length: 20 }, () => createAuditLogEntry());
    this.auditLogDataSource = new MatTableDataSource(auditLogEntries);
    console.log(this.auditLogDataSource);
  }

  ngAfterViewInit() {
    this.auditLogDataSource.paginator = this.paginator;
    this.auditLogDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.auditLogDataSource.filter = filterValue;

    if (this.auditLogDataSource.paginator) {
      this.auditLogDataSource.paginator.firstPage();
    }
  }
}
