import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Genders } from '../../constants/genders';
import { Countries } from '../../constants/countries';
import { Roles } from '../../constants/roles';
import { User } from '../../models/user';
import { map, Subject } from 'rxjs';

@Component({
  selector: 'app-table-users',
  imports: [FormsModule],
  templateUrl: './table-users.html',
  styleUrl: './table-users.css',
})
export class TableUsers {
  // To retrieve DOM elements
  @ViewChild('searchEmail') searchEmail!: ElementRef<HTMLInputElement>;

  // Constants
  public Genders = Genders;
  public Countries = Countries;
  public Roles = Roles;

  // Native classes / Application services
  private router = inject(Router);
  private userService = inject(UserService);

  // User messages
  private static msgDelUser: string = 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?';

  // Class properties
  roles!: any[];
  users: User[] = [];
  filteredItems: User[] = [];
  filteredText: User[] = [];
  filteredByEmail: User[] = [];
  filteredByRef: User[] = [];
  searchByEmailSubject: Subject<string> = new Subject<string>();
  searchByRefSubject: Subject<string> = new Subject<string>();
  selectedRole: number = -1;
  editUser!: User | null;

  // Initialization ///////////////////////////////////////////////////////////

  // Initialize the user list
  ngOnInit() {
    // Sort the roles
    this.roles = Roles.list.sort((r1: any, r2: any) => r1.value - r2.value);

    // Load all users
    this.load();

    // Search for users by email
    this.searchByEmailSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLocaleLowerCase();
          return this.users.filter((user: User) => user.email.toLowerCase().indexOf(EMAIL) === 0);
        }),
      )
      .subscribe((res: User[]) => {
        this.filteredByEmail = res;
        this.filteredText = res.filter((user: User) =>
          // Filter by user reference
          this.filteredByRef.some((item: User) => item.id === user.id),
        );
        this.filterByRole(); // Filter by user role
      });

    // Search for users by reference
    this.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.users.filter((user: User) => user.reference.indexOf(REFERENCE) === 0);
        }),
      )
      .subscribe((res: User[]) => {
        this.filteredByRef = res;
        this.filteredText = res.filter((user: User) =>
          // Filter by user email
          this.filteredByEmail.some((item: User) => item.id === user.id),
        );
        this.filterByRole(); // Filter by user role
      });
  }

  // Load and filter //////////////////////////////////////////////////////////

  // Retrieve all users
  load() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = res; // All users
        this.filteredByEmail = res;
        this.filteredByRef = res;
        this.filteredText = res;
        this.filteredItems = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by user role
  filterByRole() {
    if (this.selectedRole === -1) {
      this.filteredItems = this.filteredText;
    } else {
      this.filteredItems = this.filteredText.filter(
        (user: User) => user.role === this.selectedRole,
      );
    }
  }

  // Search ///////////////////////////////////////////////////////////////////

  // Search for users by email
  searchEmailItems(email: string) {
    this.searchByEmailSubject.next(email);
  }

  // Search for users by reference
  searchRefItems(reference: string) {
    this.searchByRefSubject.next(reference);
  }

  // Search for users by role
  selectRoleItems(select: any) {
    this.selectedRole = Number(select.options[select.selectedIndex].value);
    this.filterByRole();
  }

  // Actions //////////////////////////////////////////////////////////////////

  // Edit a user inline
  editInline(user: User) {
    // Enable inline editing
    this.editUser = new User();
    Object.assign(this.editUser, user);
  }

  // Save changes after inline editing
  saveInline(user: User) {
    if (user.name !== this.editUser?.name || user.email !== this.editUser?.email) {
      this.userService.updateUser(user).subscribe({
        next: (res: User) => {
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
  gotoForm(user: User) {
    // Redirect to the edit form
    this.router.navigate(['/edit-user-table', user.id]);
  }

  // Delete a user
  remove(id: string) {
    // Confirmaton message to delete the user
    if (confirm(TableUsers.msgDelUser)) {
      // Remove the user
      this.userService.deleteUser(id).subscribe({
        next: (res: User) => {
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
