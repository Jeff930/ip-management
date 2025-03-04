import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingService } from './services/loading.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, MatSidenavModule, MatListModule, MatExpansionModule, MatIconModule, LoaderComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  title = 'IP Management System';
  isLoginPage = false;
  userName = 'Sample Username';
  userRole = 'Sample Role';

  constructor(private authService: AuthService, private router: Router, private loadingService: LoadingService,
    private snackBar: MatSnackBar, private dialog: MatDialog, ) { }

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isLoginPage = !status;
      if (status) {
        this.userName = this.authService.getUserName();
        this.userRole = this.authService.getUserEmail();
      }
    });
  }

  toggleSidenav() {
    this.drawer.toggle();
  }

  checkViewUserPermission(){
    return this.authService.getUserPermissions().includes('view-users');
  }

  checkViewLogPermission() {
    return this.authService.getUserPermissions().includes('view-logs');
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400',
      data: {
        title: 'Confirm Logout',
        message: `Are you sure you want to log out?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.loadingService.show();
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
            this.loadingService.hide();
            this.snackBar.open('Signed out successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => {
            console.error('Logout error:', err);
            this.loadingService.hide();
            this.snackBar.open('Failed signing out user. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }

}
