import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const userResolver: ResolveFn<Observable<any>> = () => {
  const userService = inject(UserService);

  return userService.getUsers().pipe(
    catchError(error => {
      console.error('Error fetching users:', error);
      return of({ error: true, message: 'Failed to load users.' });
    })
  );
};
