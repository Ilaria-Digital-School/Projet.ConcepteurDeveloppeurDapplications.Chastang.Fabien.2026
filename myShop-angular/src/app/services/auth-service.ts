import { Injectable } from '@angular/core';
import { User, UserRole } from '../../main';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  UserRole = UserRole;

  connectedUser: User | null = null;

  getConnectedUser(): User | null {
    let user = JSON.parse(sessionStorage.getItem('connectedUser') || 'null');
    if (!user) user = JSON.parse(localStorage.getItem('connectedUser') || 'null');
    if (user) {
      this.connectedUser = new User();
      Object.assign(this.connectedUser, user);
    } else {
      this.connectedUser = null;
    }
    return this.connectedUser;
  }

  isAdmin(): boolean {
    return (
      this.getConnectedUser()?.role === UserRole.admin ||
      this.connectedUser?.role === UserRole.superAdmin
    );
  }

  logout(): void {
    localStorage.removeItem('connectedUser');
    sessionStorage.removeItem('connectedUser');
    this.connectedUser = null;
  }
}
