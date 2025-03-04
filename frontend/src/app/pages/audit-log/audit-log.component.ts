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
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { LoadingService } from '../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    CommonModule,
    DateFormatPipe,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
})
export class AuditLogComponent implements OnInit, AfterViewInit {
  auditLogColumns: string[] = ['createdAt', 'sessionId', 'actorId', 'actor', 'action', 'targetId', 'targetType', 'target', 'changes'];
  auditLogDataSource: MatTableDataSource<LogData> = new MatTableDataSource<LogData>();
  columnFilters: { [key: string]: string } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private auditService: AuditService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.fetchAuditLogs();
  }

  fetchAuditLogs() {
    this.loadingService.show();
    this.auditService.getAuditLogs().subscribe({
      next: (data) => {
        this.auditLogDataSource.data = data;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error fetching logs', err);
        this.loadingService.hide();
        if (err == 'Token refresh failed') {
          this.snackBar.open('Token expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        } else {
          this.snackBar.open('Failed fetching audit logs. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'] });
        }
      },
    });
  }

  ngAfterViewInit() {
    this.auditLogDataSource.paginator = this.paginator;
    this.auditLogDataSource.sort = this.sort;

    this.auditLogDataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.auditLogDataSource.filter = filterValue;

    if (this.auditLogDataSource.paginator) {
      this.auditLogDataSource.paginator.firstPage();
    }
  }

  applyDateFilter(column: string, event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) {
      const filterValue = date.toISOString().split('T')[0];
      this.columnFilters[column] = filterValue;
    } else {
      delete this.columnFilters[column];
    }
    this.auditLogDataSource.filter = JSON.stringify(this.columnFilters);

    if (this.auditLogDataSource.paginator) {
      this.auditLogDataSource.paginator.firstPage();
    }
  }

  applyColumnFilter(column: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.columnFilters[column] = filterValue;
    this.auditLogDataSource.filter = JSON.stringify(this.columnFilters);

    if (this.auditLogDataSource.paginator) {
      this.auditLogDataSource.paginator.firstPage();
    }
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  customFilterPredicate(data: LogData, filter: string): boolean {
    const filters = JSON.parse(filter);

    return Object.keys(filters).every((key) => {
      const filterValue = filters[key].toLowerCase();
      const dataValue = data[key];

      if (dataValue === undefined || dataValue === null) {
        return false;
      }

      if (key === 'changes' && typeof dataValue === 'object') {
        return Object.keys(dataValue).some((subKey) =>
          dataValue[subKey].toString().toLowerCase().includes(filterValue)
        );
      }

      return dataValue.toString().toLowerCase().includes(filterValue);
    });
  }
}