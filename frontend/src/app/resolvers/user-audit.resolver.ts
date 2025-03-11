import { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { AuditService } from '../services/audit.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const userAuditResolver: ResolveFn<Observable<any>> = () => {
  const userAuditService = inject(AuditService);

  return userAuditService.getUserAuditLogs().pipe(
    catchError(error => {
      console.error('Error fetching user audit logs:', error);
      return of({ error: true, message: 'Failed to load user audit logs.' });
    })
  );
};
