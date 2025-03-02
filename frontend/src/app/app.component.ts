import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, MatSidenavModule, MatListModule, MatExpansionModule, MatIconModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IP Management System';
  isLoginPage = false;
  userName = 'Sample Username';
  userRole = 'Sample Role';

  constructor(private authService: AuthService, private router: Router, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isLoginPage = !status;
      if (status) {
        this.userName = this.authService.getUserName();
        this.userRole = this.authService.getUserEmail();
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
    this.loadingService.show();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.loadingService.hide();
      },
      error: (err) => { 
        console.error('Logout error:', err);
        this.loadingService.hide();
      }
    });
  }
}
