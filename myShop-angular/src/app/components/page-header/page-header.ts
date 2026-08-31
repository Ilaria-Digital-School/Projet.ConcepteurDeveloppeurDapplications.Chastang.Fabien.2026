import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { User } from '../../models/user';
import { RoleList } from '../../models/role';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  // Native classes / Application services
  private router = inject(Router);
  private authService = inject(AuthService);
  public cartService = inject(CartService);

  // Class properties
  title: string = 'My Shop';
  connectedUser: User | null = null;
  roles: RoleList = new RoleList();

  // Method to retrieve the logged-in user
  getConnectedUser(): User | null {
    return (this.connectedUser = this.authService.getConnectedUser());
  }

  // Check if the user is an administrator
  isAdmin() {
    return this.authService.isAdmin();
  }

  // Logout
  logout() {
    this.authService.logout();
    this.connectedUser = null;
    this.router.navigate(['/']);
  }
}
