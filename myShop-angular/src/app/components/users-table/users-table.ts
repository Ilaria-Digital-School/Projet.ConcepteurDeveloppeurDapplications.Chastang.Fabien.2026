import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Genders } from '../../constants/genders';
import { Countries } from '../../constants/countries';
import { Roles } from '../../constants/roles';
import { User } from '../../models/user';

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

  users: User[] = [];
  editUser!: User | null;

  // Initialization //////////////////////////////////////////////////////

  // Initialize the user list
  ngOnInit() {
    this.load();
  }

  // Retrieve all users
  load() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = structuredClone(res);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Actions /////////////////////////////////////////////////////////////

  // Edit a user inline
  inlineEdit(user: User) {
    // Enable inline editing
    this.editUser = new User();
    this.editUser = structuredClone(user);
  }

  // Save changes after inline editing
  inlineSave(user: User) {
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

  // Edit a user using the form
  formEdit(user: User) {
    // Redirect to the edit form
    this.router.navigate(['/edit-user', user.id]);
  }

  // Delete a user
  remove(id: string) {
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
