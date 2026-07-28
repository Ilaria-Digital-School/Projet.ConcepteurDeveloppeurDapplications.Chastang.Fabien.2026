import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  title: string = 'My Shop';
  currentUser: any = null;
  userName: string = '';

  getCurrentUser(): boolean {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.currentUser.email) {
      this.userName = this.currentUser.name;
      return true;
    } else {
      this.userName = '';
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }
}
