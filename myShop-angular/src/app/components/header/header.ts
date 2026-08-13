import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart-service';
import { UserRole } from '../../enums/user-role';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  UserRole = UserRole;

  private router = inject(Router);
  private authService = inject(AuthService);
  public cartService = inject(CartService);

  title: string = 'My Shop';
  connectedUser: User | null = null;

  // Retrieve the logged-in user
  ngOnInit() {
    this.getConnectedUser();
  }

  // Method to retrieve the logged-in user
  getConnectedUser(): User | null {
    return (this.connectedUser = this.authService.getConnectedUser());
  }

  // Logout
  logout() {
    this.authService.logout();
    this.connectedUser = null;
    this.router.navigate(['/']);
  }
}
