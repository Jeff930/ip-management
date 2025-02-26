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
  ],
  templateUrl: './list-ip.component.html',
  styleUrls: ['./list-ip.component.scss'] // Note: Changed "styleUrl" to "styleUrls"
})
export class ListIpComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'addedBy', 'ip', 'label', 'actions'];
  dataSource: MatTableDataSource<IpData> = new MatTableDataSource<IpData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private ipService: IpAddressService) { }

  ngOnInit(): void {
    this.loadIpAddresses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadIpAddresses(): void {
    this.ipService.getIpAddresses().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error('Error fetching IPs', err)
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
        this.ipService.addIpAddress(result).subscribe({
          next: (newIp) => {
            this.dataSource.data = [...this.dataSource.data, newIp];
          },
          error: (err) => console.error('Error adding IP', err)
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
        this.ipService.updateIpAddress(row.id, result).subscribe({
          next: (response: any) => {
            const updatedIp = response.ip; // Extract the user from the response
            const index = this.dataSource.data.findIndex(item => item.id === row.id);
            if (index !== -1) {
              console.log(updatedIp);
              this.dataSource.data[index] = updatedIp;
              console.log(this.dataSource.data);
              this.dataSource.data = [...this.dataSource.data]; // Refresh table data
            }
          },
          error: (err) => console.error('Error updating IP', err)
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
    if (confirm('Are you sure you want to delete this IP?')) {
      this.ipService.deleteIpAddress(row.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
        },
        error: (err) => console.error('Error deleting IP', err)
      });
    }
  }
}
