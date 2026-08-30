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

  // Retrieve the logged-in user
  ngOnInit() {
    this.getConnectedUser();
  }

  // Method to retrieve the logged-in user
  getConnectedUser(): User | null {
    return (this.connectedUser = this.authService.getConnectedUser());
  }

  // Check if the user is an admin
  isAdmin() {
    return this.connectedUser !== null && this.connectedUser.role > 0;
  }

  // Logout
  logout() {
    this.authService.logout();
    this.connectedUser = null;
    this.router.navigate(['/']);
  }
}
