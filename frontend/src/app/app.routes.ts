import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { userResolver } from './resolvers/user.resolver';
import { ipResolver } from './resolvers/ip.resolver';
import { auditResolver } from './resolvers/audit.resolver';
import { profileResolver } from './resolvers/profile.resolver';

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
        path: '',
        pathMatch: 'full',
        redirectTo: 'list-ip'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
        resolve: { profile: profileResolver }
      },
      {
        path: 'list-ip',
        loadComponent: () =>
          import('./pages/list-ip/list-ip.component').then((m) => m.ListIpComponent),
        resolve: { ipAddresses: ipResolver }
      },
      {
        path: 'list-user',
        loadComponent: () =>
          import('./pages/list-user/list-user.component').then((m) => m.ListUserComponent),
        data: { permission: 'view-users' },
        resolve: { users: userResolver }
      },
      {
        path: 'audit-log',
        loadComponent: () =>
          import('./pages/audit-log/audit-log.component').then((m) => m.AuditLogComponent),
        data: { permission: 'view-logs' },
        resolve: { auditLogs: auditResolver }
      }
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
