import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { DashboardHandle } from '../../models/dashboard';
import { ItemCstShort } from '../../types/items';
import { UserGenders } from '../../constants/user-genders';
import { UserCountries } from '../../constants/user-countries';
import { UserRoles } from '../../constants/user-roles';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

@Component({
  selector: 'app-table-users',
  imports: [FormsModule],
  templateUrl: './table-users.html',
  styleUrl: './table-users.css',
})
export class TableUsers {
  // To retrieve DOM elements
  @ViewChild('emailUsers') emailUsers!: ElementRef<HTMLInputElement>;
  @ViewChild('sortName') sortName!: ElementRef<HTMLElement>;
  @ViewChild('sortEmail') sortEmail!: ElementRef<HTMLElement>;
  @ViewChild('sortRole') sortRole!: ElementRef<HTMLElement>;

  // Constants
  public UserGenders = UserGenders;
  public UserCountries = UserCountries;
  public UserRoles = UserRoles;

  // Native classes / Application services
  private router = inject(Router);
  private userService = inject(UserService);

  // User messages
  private static msgDelUser: string = 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?';

  // Class properties
  roles!: ItemCstShort[];
  dashboard: DashboardHandle<User> = new DashboardHandle<User>();
  editUser!: User | null;

  // Initialization ///////////////////////////////////////////////////////////

  // Initialize the user list
  ngOnInit() {
    // Sort the roles
    this.roles = UserRoles.list.sort((r1: ItemCstShort, r2: ItemCstShort) => r1.value - r2.value);

    // Load all users
    this.load();

    // Search for users by email
    this.dashboard.searchByTextSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLocaleLowerCase();
          return this.dashboard.arrays.unfiltered.filter(
            (user: User) => user.email.toLowerCase().indexOf(EMAIL) === 0,
          );
        }),
      )
      .subscribe((res: User[]) => {
        this.dashboard.arrays.filteredByText = res;
        this.dashboard.arrays.filteredText = res.filter((user: User) =>
          // Filter by user reference
          this.dashboard.arrays.filteredByRef.some((item: User) => item.id === user.id),
        );
        this.filterByValue(); // Filter by user role
      });

    // Search for users by reference
    this.dashboard.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.dashboard.arrays.unfiltered.filter(
            (user: User) => user.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: User[]) => {
        this.dashboard.arrays.filteredByRef = res;
        this.dashboard.arrays.filteredText = res.filter((user: User) =>
          // Filter by user email
          this.dashboard.arrays.filteredByText.some((item: User) => item.id === user.id),
        );
        this.filterByValue(); // Filter by user role
      });
  }

  // Initialize the dashboard.arrays that handle the sorting
  ngAfterViewInit() {
    // Defines the sorting elements: here, all attributes are fixed
    this.dashboard.sortElements = [
      { col: 'name', up: true, func: this.sortByName, HTMLCol: this.sortName.nativeElement },
      { col: 'email', up: true, func: this.sortByEmail, HTMLCol: this.sortEmail.nativeElement },
      { col: 'role', up: true, func: this.sortByRole, HTMLCol: this.sortRole.nativeElement },
    ];
    // Defines the sorting variables: 'sort' and/or 'up' are updated each time a sort is performed
    this.dashboard.sortVariables = [
      { col: 'name', sort: true, up: true },
      { col: 'email', sort: false, up: true },
      { col: 'role', sort: false, up: true },
    ];
    // Initialize the filter method
    this.dashboard.filterByValue = this.filterByValue;
  }

  // Load and filter //////////////////////////////////////////////////////////

  // Retrieve all users
  load() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        // All users
        this.dashboard.arrays.unfiltered = res.sort((item1: User, item2: User) => {
          const COMPARE = item1.name.localeCompare(item2.name);
          return COMPARE === 0 ? item1.email.localeCompare(item2.email) : COMPARE;
        });
        this.dashboard.arrays.filteredByText = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredByRef = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredText = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredItems = structuredClone(this.dashboard.arrays.unfiltered);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by user role
  filterByValue() {
    if (this.dashboard.selectedValue === -1) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredText;
    } else {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredText.filter(
        (user: User) => user.role === this.dashboard.selectedValue,
      );
    }
  }

  // Sort /////////////////////////////////////////////////////////////////////

  // Sort users by name (default)
  sortByName(array: User[], up: boolean): User[] {
    if (up) {
      return array.sort((item1: User, item2: User) => {
        const COMPARE = item1.name.localeCompare(item2.name);
        return COMPARE === 0 ? item1.email.localeCompare(item2.email) : COMPARE;
      });
    } else {
      return array.sort((item1: User, item2: User) => {
        const COMPARE = item2.name.localeCompare(item1.name);
        return COMPARE === 0 ? item2.email.localeCompare(item1.email) : COMPARE;
      });
    }
  }

  // Sort users by email
  sortByEmail(array: User[], up: boolean): User[] {
    if (up) {
      return array.sort((item1: User, item2: User) => item1.email.localeCompare(item2.email));
    } else {
      return array.sort((item1: User, item2: User) => item2.email.localeCompare(item1.email));
    }
  }

  // Sort users by email
  sortByRole(array: User[], up: boolean): User[] {
    if (up) {
      return array.sort((item1: User, item2: User) => {
        const COMPARE = item1.role - item2.role;
        return COMPARE === 0 ? item1.email.localeCompare(item2.email) : COMPARE;
      });
    } else {
      return array.sort((item1: User, item2: User) => {
        const COMPARE = item2.role - item1.role;
        return COMPARE === 0 ? item2.email.localeCompare(item1.email) : COMPARE;
      });
    }
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
      const USER = new User();
      Object.assign(USER, user);

      this.userService.updateUser(USER).subscribe({
        next: (res: User) => {
          alert("L'utilisateur a été modifié.");

          // Updating the user table
          if (user.email !== this.editUser?.email)
            this.dashboard.searchTextItems(this.emailUsers.nativeElement.value);
        },
        error: (err: any) => {
          alert("Une erreur s'est produite.");
          console.log(err);
        },
      });
    }
    // Disable inline editing
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
          this.dashboard.arrays.unfiltered = this.dashboard.arrays.unfiltered.filter(
            (item: User) => item.id !== id,
          );
          this.dashboard.arrays.filteredText = this.dashboard.arrays.filteredText.filter(
            (item: User) => item.id !== id,
          );
          this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredItems.filter(
            (item: User) => item.id !== id,
          );

          // Disable inline editing if necessary
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
