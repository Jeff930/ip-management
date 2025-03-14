import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserLogData } from '../../services/audit.service';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { format, toZonedTime } from 'date-fns-tz';

@Component({
  selector: 'app-user-audit-log',
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
  templateUrl: './user-audit-log.component.html',
  styleUrl: './user-audit-log.component.scss'
})
export class UserAuditLogComponent {
  userAuditLogColumns: string[] = [
    'created_at', 
    'session_id', 
    'actor_id', 
    'actor_name', 
    'action', 
    'target_id', 
    'target_type', 
    'target', 
    'changes'
  ];
  userAuditLogDataSource: MatTableDataSource<UserLogData> = new MatTableDataSource<UserLogData>();
  columnFilters: { [key: string]: string } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      if (data['userAuditLogs'].error) {
        this.snackBar.open(data['userAuditLogs'].message, 'Close', { duration: 3000 });
      } else {
        this.userAuditLogDataSource.data = data['userAuditLogs'];
      }
    });
  }

  ngAfterViewInit() {
    this.userAuditLogDataSource.paginator = this.paginator;
    this.userAuditLogDataSource.sort = this.sort;

    this.userAuditLogDataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.userAuditLogDataSource.filter = filterValue;

    if (this.userAuditLogDataSource.paginator) {
      this.userAuditLogDataSource.paginator.firstPage();
    }
  }

  applyDateFilter(column: string, event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) {
      const filterValue = format(date, 'yyyy-MM-dd');
      this.columnFilters[column] = filterValue;
    } else {
      delete this.columnFilters[column];
    }
    this.userAuditLogDataSource.filter = JSON.stringify(this.columnFilters);
  
    if (this.userAuditLogDataSource.paginator) {
      this.userAuditLogDataSource.paginator.firstPage();
    }
  }

  applyColumnFilter(column: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.columnFilters[column] = filterValue;
    this.userAuditLogDataSource.filter = JSON.stringify(this.columnFilters);

    if (this.userAuditLogDataSource.paginator) {
      this.userAuditLogDataSource.paginator.firstPage();
    }
  }

  getKeys(changes: any): string[] {
    return changes && typeof changes === 'object' ? Object.keys(changes) : [];
  }

  customFilterPredicate(data: UserLogData, filter: string): boolean {
    const filters = JSON.parse(filter);

    return Object.keys(filters).every((key) => {
      const filterValue = filters[key].toLowerCase();
      const dataValue = data[key];

      if (dataValue === undefined || dataValue === null) {
        return false;
      }

      if (key === 'created_at') {
        const localTime = toZonedTime(dataValue, Intl.DateTimeFormat().resolvedOptions().timeZone);
        const localDate = format(localTime, 'yyyy-MM-dd');
        return localDate === filterValue; 
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
