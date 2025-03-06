import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuditService } from '../services/audit.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const auditResolver: ResolveFn<Observable<any>> = () => {
  const auditService = inject(AuditService);

  return auditService.getAuditLogs().pipe(
    catchError(error => {
      console.error('Error fetching audit logs:', error);
      return of({ error: true, message: 'Failed to load audit logs.' });
    })
  );
};
