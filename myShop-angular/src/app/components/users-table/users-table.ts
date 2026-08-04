import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../main';
import { Countries } from '../../../main';
import { Genders } from '../../../main';
import { Roles } from '../../../main';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css',
})
export class UsersTable {
  private router = inject(Router);
  private userService = inject(UserService);

  Genders = Genders;
  Countries = Countries;
  Roles = Roles;

  users!: User[];

  load(): void {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.map((item: any) => {
          const USER = new User();
          Object.assign(USER, item);
          return USER;
        });
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    this.load();
  }

  edit(id: string): void {
    this.router.navigate(['/user-edit', id]);
  }

  remove(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Remove the product
      const USERS = this.users.filter((item: User) => item.id !== id);
      // localStorage.setItem('users', JSON.stringify(USERS));

      // Refresh the product list
      this.users = USERS;
    }
  }
}
