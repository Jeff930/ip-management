import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuditService, LogData } from '../../services/audit.service';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
})
export class AuditLogComponent implements OnInit, AfterViewInit {
  auditLogColumns: string[] = ['createdAt', 'session','actor', 'action','target', 'changes'];
  auditLogDataSource: MatTableDataSource<LogData> = new MatTableDataSource<LogData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private auditService: AuditService) {}

  ngOnInit() {
    this.fetchAuditLogs();
  }

  fetchAuditLogs() {
    this.auditService.getAuditLogs().subscribe({
      next: (data) => {
        this.auditLogDataSource.data = data;
      },
      error: (err) => console.error('Error fetching IPs', err)
    });
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

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
