import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredPermission = route.data['permission'];
    const userPermissions = this.authService.getUserPermissions();
    
    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      this.router.navigate(['/not-found']);
      return false;
    }

    return true;
  }
}
