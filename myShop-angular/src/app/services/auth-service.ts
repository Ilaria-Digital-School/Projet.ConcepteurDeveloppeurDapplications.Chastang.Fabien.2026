import { Injectable } from '@angular/core';
import { EnumRoles } from '../enums/user-roles';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
      this.getConnectedUser()?.role === EnumRoles.admin ||
      this.connectedUser?.role === EnumRoles.superAdmin
    );
  }

  logout(): void {
    localStorage.removeItem('connectedUser');
    sessionStorage.removeItem('connectedUser');
    this.connectedUser = null;
  }
}
