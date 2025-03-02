import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [LoginGuard]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
      },
      {
        path: 'list-ip',
        loadComponent: () =>
          import('./pages/list-ip/list-ip.component').then((m) => m.ListIpComponent)
      },
      {
        path: 'list-user',
        loadComponent: () =>
          import('./pages/list-user/list-user.component').then((m) => m.ListUserComponent),
        data: { permission: 'view-users' }
      },
      {
        path: 'audit-log',
        loadComponent: () =>
          import('./pages/audit-log/audit-log.component').then((m) => m.AuditLogComponent),
        data: { permission: 'view-logs' }
      }
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
