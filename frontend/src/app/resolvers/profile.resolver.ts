import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const profileResolver: ResolveFn<Observable<any>> = () => {
  const authService = inject(AuthService);

  return authService.getUser().pipe(
    catchError(error => {
      console.error('Error fetching profile:', error);
      return of({ error: true, message: 'Failed to load profile.' });
    })
  );
};
