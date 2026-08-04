import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../main';
import { Countries } from '../../../main';
import { Genders } from '../../../main';
import { Roles } from '../../../main';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users-table',
  imports: [FormsModule],
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
  editUser!: User | null;

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

  edit(user: User): void {
    // Redirect to the form
    // this.router.navigate(['/user-edit', user.id]);

    // Or edit online
    this.editUser = new User();
    this.editUser = structuredClone(user);
  }

  save(user: User): void {
    if (user.name !== this.editUser?.name || user.email !== this.editUser?.email) {
      this.userService.updateUser(user).subscribe({
        next: (res: Object) => {
          alert("L'utilisateur a été modifié.");
        },
        error: (err: any) => {
          alert("Une erreur s'est produite.");
          console.log(err);
        },
      });
    }
    this.editUser = null;
  }

  remove(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Remove the user
      this.userService.deleteUser(id).subscribe({
        next: (res: Object) => {
          // Refresh the user list without calling the server
          this.users = this.users.filter((item: User) => item.id !== id);
          if (this.editUser) this.editUser = null;
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la suppression.");
          console.log(err);
        },
      });
    }
  }
}
