import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { IpAddressService } from '../services/ip-address.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const ipResolver: ResolveFn<Observable<any>> = () => {
  const ipAddressService = inject(IpAddressService);

  return ipAddressService.getIpAddresses().pipe(
    catchError(error => {
      console.error('Error fetching IP Addresses:', error);
      return of({ error: true, message: 'Failed to load IP Addresses.' });
    })
  );
};
