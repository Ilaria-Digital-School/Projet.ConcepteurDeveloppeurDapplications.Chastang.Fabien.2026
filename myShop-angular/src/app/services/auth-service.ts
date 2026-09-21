import { Injectable } from '@angular/core';
import { TokenPayload } from '../models/user';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  connectedUser: TokenPayload | null = null;

  getConnectedUser(): TokenPayload | null {
    const TOKEN = sessionStorage.getItem('token') || localStorage.getItem('token');
    return (this.connectedUser = TOKEN ? Common.decodeToken(TOKEN) : null);
  }

  isAdmin(): boolean {
    this.getConnectedUser();
    return this.connectedUser !== null && this.connectedUser.role > 0;
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.connectedUser = null;
  }
}
