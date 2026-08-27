import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { UserService } from '../../services/user-service';
import { UserGenders } from '../../constants/user-genders';
import { UserCountries } from '../../constants/user-countries';
import { UserRoles } from '../../constants/user-roles';
import { User } from '../../models/user';
import { ItemCstShort, SortParams } from '../../constants/global/types';

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
  users: User[] = [];
  filteredItems: User[] = [];
  filteredText: User[] = [];
  filteredByEmail: User[] = [];
  filteredByRef: User[] = [];
  searchByEmailSubject: Subject<string> = new Subject<string>();
  searchByRefSubject: Subject<string> = new Subject<string>();
  selectedRole: number = -1;
  sortColumns!: SortParams[];
  editUser!: User | null;

  // Initialization ///////////////////////////////////////////////////////////

  // Initialize the user list
  ngOnInit() {
    // Initialize the array that handles the sorting
    this.sortColumns = [
      { col: 'name', sort: true, up: true },
      { col: 'email', sort: false, up: true },
      { col: 'role', sort: false, up: true },
    ];

    // Sort the roles
    this.roles = UserRoles.list.sort((r1: ItemCstShort, r2: ItemCstShort) => r1.value - r2.value);

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
        // All users
        this.users = res.sort((item1: User, item2: User) => {
          const COMPARE = item1.name.localeCompare(item2.name);
          return COMPARE === 0 ? item1.email.localeCompare(item2.email) : COMPARE;
        });
        this.filteredByEmail = structuredClone(this.users);
        this.filteredByRef = structuredClone(this.users);
        this.filteredText = structuredClone(this.users);
        this.filteredItems = structuredClone(this.users);
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

  // Sort /////////////////////////////////////////////////////////////////////

  sort(column: string) {
    const SORT = this.sortColumns.find((item: SortParams) => item.sort);
    if (SORT) {
      switch (column) {
        case 'email':
          // Sort users by email
          if (SORT.col === column) {
            SORT.up = !SORT.up;
            this.users = this.sortByEmail(this.users, SORT.up);
            this.filteredByEmail = this.sortByEmail(this.filteredByEmail, SORT.up);
            this.filteredByRef = this.sortByEmail(this.filteredByRef, SORT.up);
            this.filteredText = this.sortByEmail(this.filteredText, SORT.up);
            this.filteredItems = this.sortByEmail(this.filteredItems, SORT.up);
            if (SORT.up) {
              this.sortEmail.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
            } else {
              this.sortEmail.nativeElement.classList.replace('fa-caret-up', 'fa-caret-down');
            }
          } else {
            this.initSort(SORT, column);
            this.users = this.sortByEmail(this.users, true);
            this.filteredByEmail = this.sortByEmail(this.filteredByEmail, true);
            this.filteredByRef = this.sortByEmail(this.filteredByRef, true);
            this.filteredText = this.sortByEmail(this.filteredText, true);
            this.filteredItems = this.sortByEmail(this.filteredItems, true);
            this.sortEmail.nativeElement.classList.remove('hidden');
            this.sortEmail.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
          }
          break;

        case 'role':
          // Sort users by role
          if (SORT.col === column) {
            SORT.up = !SORT.up;
            this.users = this.sortByRole(this.users, SORT.up);
            this.filteredByEmail = this.sortByRole(this.filteredByEmail, SORT.up);
            this.filteredByRef = this.sortByRole(this.filteredByRef, SORT.up);
            this.filteredText = this.sortByRole(this.filteredText, SORT.up);
            this.filteredItems = this.sortByRole(this.filteredItems, SORT.up);
            if (SORT.up) {
              this.sortRole.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
            } else {
              this.sortRole.nativeElement.classList.replace('fa-caret-up', 'fa-caret-down');
            }
          } else {
            this.initSort(SORT, column);
            this.users = this.sortByRole(this.users, true);
            this.filteredByEmail = this.sortByRole(this.filteredByEmail, true);
            this.filteredByRef = this.sortByRole(this.filteredByRef, true);
            this.filteredText = this.sortByRole(this.filteredText, true);
            this.filteredItems = this.sortByRole(this.filteredItems, true);
            this.sortRole.nativeElement.classList.remove('hidden');
            this.sortRole.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
          }
          break;

        default:
          // Sort users by name
          if (SORT.col === column) {
            SORT.up = !SORT.up;
            this.users = this.sortByName(this.users, SORT.up);
            this.filteredByEmail = this.sortByName(this.filteredByEmail, SORT.up);
            this.filteredByRef = this.sortByName(this.filteredByRef, SORT.up);
            this.filteredText = this.sortByName(this.filteredText, SORT.up);
            this.filteredItems = this.sortByName(this.filteredItems, SORT.up);
            if (SORT.up) {
              this.sortName.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
            } else {
              this.sortName.nativeElement.classList.replace('fa-caret-up', 'fa-caret-down');
            }
          } else {
            this.initSort(SORT, column);
            this.users = this.sortByName(this.users, true);
            this.filteredByEmail = this.sortByName(this.filteredByEmail, true);
            this.filteredByRef = this.sortByName(this.filteredByRef, true);
            this.filteredText = this.sortByName(this.filteredText, true);
            this.filteredItems = this.sortByName(this.filteredItems, true);
            this.sortName.nativeElement.classList.remove('hidden');
            this.sortName.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
          }
      }
    }
  }

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

  // Initialise the sort when the column changes
  initSort(sorted: SortParams, column: string, up: boolean = true) {
    sorted.sort = false;
    switch (sorted.col) {
      case 'email':
        this.sortEmail.nativeElement.classList.add('hidden');
        break;
      case 'role':
        this.sortRole.nativeElement.classList.add('hidden');
        break;
      default:
        this.sortName.nativeElement.classList.add('hidden');
    }

    const TO_SORT = this.sortColumns.find((item: SortParams) => item.col === column);
    if (TO_SORT) {
      TO_SORT.sort = true;
      TO_SORT.up = up;
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
            this.searchEmailItems(this.emailUsers.nativeElement.value);
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
          this.users = this.users.filter((item: User) => item.id !== id);
          this.filteredText = this.filteredText.filter((item: User) => item.id !== id);
          this.filteredItems = this.filteredItems.filter((item: User) => item.id !== id);

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
