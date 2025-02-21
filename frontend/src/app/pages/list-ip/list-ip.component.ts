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
import { IpDialogComponent } from '../../components/ip-dialog/ip-dialog.component';


export interface IpData {
  id: string;
  addedBy: string;
  ip: string;
  label: string;
  createdAt: string;
  comment?: string;
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

const LABELS: string[] = ['Home', 'Office', 'VPN', 'Server', 'Cloud'];

const IP_ADDRESSES: string[] = [
  '192.168.1.1',
  '10.0.0.1',
  '172.16.0.1',
  '203.0.113.5',
  '192.168.100.50',
  '8.8.8.8',
  '2001:db8::ff00:42:8329',
  'fe80::1ff:fe23:4567:890a',
  '2606:4700:4700::1111',
  '2800:3f0::1',
];

const COMMENTS: string[] = [
  'Main router',
  'Office network',
  'For VPN access',
  'Temporary IP',
  'Cloud Server',
  'Public DNS',
  'IPv6 Testing',
  'Firewall whitelist',
  'Secure connection',
  '',
];

function randomDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

function createNewIpEntry(id: number): IpData {
  return {
    id: id.toString(),
    addedBy: USERS[Math.floor(Math.random() * USERS.length)],
    ip: IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)],
    label: LABELS[Math.floor(Math.random() * LABELS.length)],
    createdAt: randomDate(),
    comment: COMMENTS[Math.floor(Math.random() * COMMENTS.length)],
  };
}

@Component({
  selector: 'app-list-ip',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './list-ip.component.html',
  styleUrl: './list-ip.component.scss',
})
export class ListIpComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'addedBy', 'ip', 'label', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<IpData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {
    const ipEntries = Array.from({ length: 20 }, (_, k) => createNewIpEntry(k + 1));
    this.dataSource = new MatTableDataSource(ipEntries);
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
    const dialogRef = this.dialog.open(IpDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, { id: this.dataSource.data.length + 1, ...result }];
      }
    });
  }

  editData(row: any) {
    const dialogRef = this.dialog.open(IpDialogComponent, {
      width: '400px',
      data: { mode: 'edit', ipData: row }
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
    this.dialog.open(IpDialogComponent, {
      width: '400px',
      data: { mode: 'view', ipData: row }
    });
  }

  deleteData(row: any) {
    if (confirm('Are you sure you want to delete this IP?')) {
      console.log('Deleted IP:', row);
    }
  }
}
