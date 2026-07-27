import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) {}

  users: any[] = [];
  user = {
    email: '',
    pswd: '',
  };

  login(loginForm: NgForm): boolean {
    // Search for the user among the registered users
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    if (
      this.users.some((user: any) => user.email == this.user.email && user.pswd == this.user.pswd)
    ) {
      this.router.navigate(['/']);
      return true;
    } else {
      alert("Ce compte n'existe pas !");
      this.router.navigate(['/add-user']);
      return false;
    }
  }
}
