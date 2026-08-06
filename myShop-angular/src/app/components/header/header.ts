import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { User, UserRole } from '../../../main';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private authService = inject(AuthService);
  UserRole = UserRole;

  title: string = 'My Shop';
  connectedUser: User | null = null;

  // Retrieve the logged-in user
  ngOnInit(): void {
    this.getConnectedUser();
  }

  // Method to retrieve the logged-in user
  getConnectedUser(): User | null {
    return (this.connectedUser = this.authService.getConnectedUser());
  }

  // Logout
  logout(): void {
    this.authService.logout();
    this.connectedUser = null;
    this.router.navigate(['/']);
  }
}
