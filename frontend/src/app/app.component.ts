import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, MatSidenavModule, MatListModule, MatExpansionModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IP Management System';
  isLoginPage = false;
  userName = 'Sample Username';
  userRole = 'Sample Role';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isLoginPage = !status;
      if (status) {
        this.authService.getUser().subscribe({
          next: (user) => {
            console.log("user",user);
            this.userName = user.name;
            this.userRole = user.role.name;
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });
      }
    });
  }

  checkViewUserPermission(){
    return this.authService.getUserPermissions().includes('view-users');
  }

  checkViewLogPermission() {
    return this.authService.getUserPermissions().includes('view-logs');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout error:', err)
    });
  }
}
