import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Countries } from '../../../assets/ts/countries';
import { Genders } from '../../../assets/ts/genders';
import { Roles } from '../../../assets/ts/roles';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css',
})
export class UsersTable {
  constructor(private router: Router) {}

  genders: any = Genders;
  countries: any = Countries;
  roles: any = Roles;

  users!: any[];

  ngOnInit(): void {
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
  }

  edit(id: number): void {
    this.router.navigate(['/user-edit', id]);
  }

  remove(id: number): void {
    // Remove the product
    const USERS = this.users.filter((item: any) => item.id != id);
    localStorage.setItem('users', JSON.stringify(USERS));

    // Refresh the product list
    this.users = USERS;
  }
}
