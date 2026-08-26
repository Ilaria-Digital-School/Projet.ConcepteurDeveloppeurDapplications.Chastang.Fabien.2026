import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Subject } from 'rxjs';
import { UserService } from '../../services/user-service';
import { OrderService } from '../../services/order-service';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { Common } from '../../constants/global/common';
import { Status } from '../../constants/order-status';
import { SortParams, OrderExt } from '../../constants/global/types';

@Component({
  selector: 'app-table-orders',
  imports: [DatePipe, RouterLink],
  templateUrl: './table-orders.html',
  styleUrl: './table-orders.css',
})
export class TableOrders {
  // To retrieve DOM elements
  @ViewChild('emailOrders') emailOrders!: ElementRef<HTMLInputElement>;
  @ViewChild('sortEmail') sortEmail!: ElementRef<HTMLElement>;
  @ViewChild('sortDate') sortDate!: ElementRef<HTMLElement>;
  @ViewChild('sortStatus') sortStatus!: ElementRef<HTMLElement>;

  // Constants
  public Common = Common;
  public Status = Status;

  // Native classes / Application services
  private userService = inject(UserService);
  private orderService = inject(OrderService);

  // Class properties
  ordersUsers: OrderExt[] = [];
  filteredText: OrderExt[] = [];
  filteredItems: OrderExt[] = [];
  filteredByEmail: OrderExt[] = [];
  filteredByRef: OrderExt[] = [];
  searchByEmailSubject: Subject<string> = new Subject<string>();
  searchByRefSubject: Subject<string> = new Subject<string>();
  selectedStatus: number = -1;
  sortColumns!: SortParams[];

  // Initialize ///////////////////////////////////////////////////////////////

  ngOnInit() {
    // Initialize the array that handles the sorting
    this.sortColumns = [
      { col: 'email', sort: false, up: true },
      { col: 'date', sort: true, up: false },
      { col: 'status', sort: false, up: true },
    ];

    // Load data
    this.load();

    // Search for users by email
    this.searchByEmailSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLocaleLowerCase();
          return this.ordersUsers.filter(
            (orderExt: OrderExt) => orderExt.user?.email.toLowerCase().indexOf(EMAIL) === 0,
          );
        }),
      )
      .subscribe((res: OrderExt[]) => {
        this.filteredByEmail = res;
        this.filteredText = res.filter((orderExt: OrderExt) =>
          // Filter by order reference
          this.filteredByRef.some((item: OrderExt) => item.order.id === orderExt.order.id),
        );
        this.filterByStatus(); // Filter by order status
      });

    // Search for orders by reference
    this.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.ordersUsers.filter(
            (orderExt: OrderExt) => orderExt.order.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: OrderExt[]) => {
        this.filteredByRef = res;
        this.filteredText = res.filter((orderExt: OrderExt) =>
          // Filter by user email
          this.filteredByEmail.some((item: OrderExt) => item.order.id === orderExt.order.id),
        );
        this.filterByStatus(); // Filter by order status
      });
  }

  // Load and filter //////////////////////////////////////////////////////////

  // Load data
  load() {
    // Retrieve all orders before loading the users
    this.orderService.getAllOrders().subscribe({
      next: (res: Order[]) => {
        this.loadUsers(res); // Retrieve all users and associate all orders with their users
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Retrieve all users and associate all orders with their users
  loadUsers(orders: Order[]) {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        // All orders associate with their users
        this.ordersUsers = orders
          .map((order: Order) => {
            return { order: order, user: res.find((user: User) => user.id === order.userId) };
          })
          .sort((item1: OrderExt, item2: OrderExt) => item2.order.date - item1.order.date);
        this.filteredByEmail = structuredClone(this.ordersUsers);
        this.filteredByRef = structuredClone(this.ordersUsers);
        this.filteredText = structuredClone(this.ordersUsers);
        this.filteredItems = structuredClone(this.ordersUsers);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by order status
  filterByStatus() {
    if (this.selectedStatus === -1) {
      this.filteredItems = this.filteredByEmail;
    } else {
      this.filteredItems = this.filteredByEmail.filter(
        (orderExt: OrderExt) => orderExt.order.status === this.selectedStatus,
      );
    }
  }

  // Search ///////////////////////////////////////////////////////////////////

  // Search for users by email
  searchEmailItems(email: string) {
    this.searchByEmailSubject.next(email);
  }

  // Search for orders by reference
  searchRefItems(reference: string) {
    this.searchByRefSubject.next(reference);
  }

  // Search for orders by status
  selectStatusItems(select: any) {
    this.selectedStatus = Number(select.options[select.selectedIndex].value);
    this.filterByStatus();
  }

  // Sort /////////////////////////////////////////////////////////////////////

  sort(column: string) {
    const SORT = this.sortColumns.find((item: SortParams) => item.sort);
    if (SORT !== undefined) {
      switch (column) {
        case 'email':
          // Sort users by email
          if (SORT.col === column) {
            SORT.up = !SORT.up;
            this.ordersUsers = this.sortByEmail(this.ordersUsers, SORT.up);
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
            this.ordersUsers = this.sortByEmail(this.ordersUsers, true);
            this.filteredByEmail = this.sortByEmail(this.filteredByEmail, true);
            this.filteredByRef = this.sortByEmail(this.filteredByRef, true);
            this.filteredText = this.sortByEmail(this.filteredText, true);
            this.filteredItems = this.sortByEmail(this.filteredItems, true);
            this.sortEmail.nativeElement.classList.remove('hidden');
            this.sortEmail.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
          }
          break;

        case 'status':
          // Sort orders by status
          if (SORT.col === column) {
            SORT.up = !SORT.up;
            this.ordersUsers = this.sortByStatus(this.ordersUsers, SORT.up);
            this.filteredByEmail = this.sortByStatus(this.filteredByEmail, SORT.up);
            this.filteredByRef = this.sortByStatus(this.filteredByRef, SORT.up);
            this.filteredText = this.sortByStatus(this.filteredText, SORT.up);
            this.filteredItems = this.sortByStatus(this.filteredItems, SORT.up);
            if (SORT.up) {
              this.sortStatus.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
            } else {
              this.sortStatus.nativeElement.classList.replace('fa-caret-up', 'fa-caret-down');
            }
          } else {
            this.initSort(SORT, column);
            this.ordersUsers = this.sortByStatus(this.ordersUsers, true);
            this.filteredByEmail = this.sortByStatus(this.filteredByEmail, true);
            this.filteredByRef = this.sortByStatus(this.filteredByRef, true);
            this.filteredText = this.sortByStatus(this.filteredText, true);
            this.filteredItems = this.sortByStatus(this.filteredItems, true);
            this.sortStatus.nativeElement.classList.remove('hidden');
            this.sortStatus.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
          }
          break;

        default:
          // Sort orders by date
          if (SORT.col === column) {
            SORT.up = !SORT.up;
            this.ordersUsers = this.sortByDate(this.ordersUsers, SORT.up);
            this.filteredByEmail = this.sortByDate(this.filteredByEmail, SORT.up);
            this.filteredByRef = this.sortByDate(this.filteredByRef, SORT.up);
            this.filteredText = this.sortByDate(this.filteredText, SORT.up);
            this.filteredItems = this.sortByDate(this.filteredItems, SORT.up);
            if (SORT.up) {
              this.sortDate.nativeElement.classList.replace('fa-caret-down', 'fa-caret-up');
            } else {
              this.sortDate.nativeElement.classList.replace('fa-caret-up', 'fa-caret-down');
            }
          } else {
            this.initSort(SORT, column, false);
            this.ordersUsers = this.sortByDate(this.ordersUsers, false);
            this.filteredByEmail = this.sortByDate(this.filteredByEmail, false);
            this.filteredByRef = this.sortByDate(this.filteredByRef, false);
            this.filteredText = this.sortByDate(this.filteredText, false);
            this.filteredItems = this.sortByDate(this.filteredItems, false);
            this.sortDate.nativeElement.classList.remove('hidden');
            this.sortDate.nativeElement.classList.replace('fa-caret-up', 'fa-caret-down');
          }
      }
    }
  }

  // Sort orders by date (default)
  sortByDate(array: OrderExt[], up: boolean): OrderExt[] {
    if (up) {
      return array.sort((item1: OrderExt, item2: OrderExt) => item1.order.date - item2.order.date);
    } else {
      return array.sort((item1: OrderExt, item2: OrderExt) => item2.order.date - item1.order.date);
    }
  }

  // Sort users by email
  sortByEmail(array: OrderExt[], up: boolean): OrderExt[] {
    if (up) {
      return array.sort((item1: OrderExt, item2: OrderExt) => {
        const COMPARE =
          item1.user !== undefined && item2.user !== undefined
            ? item1.user.email.localeCompare(item2.user.email)
            : 0;
        return COMPARE === 0 ? item1.order.date - item2.order.date : COMPARE;
      });
    } else {
      return array.sort((item1: OrderExt, item2: OrderExt) => {
        const COMPARE =
          item1.user !== undefined && item2.user !== undefined
            ? item2.user.email.localeCompare(item1.user.email)
            : 0;
        return COMPARE === 0 ? item2.order.date - item1.order.date : COMPARE;
      });
    }
  }

  // Sort users by name
  sortByStatus(array: OrderExt[], up: boolean): OrderExt[] {
    if (up) {
      return array.sort((item1: OrderExt, item2: OrderExt) => {
        const COMPARE = item1.order.status - item2.order.status;
        return COMPARE === 0 ? item1.order.date - item2.order.date : COMPARE;
      });
    } else {
      return array.sort((item1: OrderExt, item2: OrderExt) => {
        const COMPARE = item2.order.status - item1.order.status;
        return COMPARE === 0 ? item2.order.date - item1.order.date : COMPARE;
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
      case 'status':
        this.sortStatus.nativeElement.classList.add('hidden');
        break;
      default:
        this.sortDate.nativeElement.classList.add('hidden');
    }

    const TO_SORT = this.sortColumns.find((item: SortParams) => item.col === column);
    if (TO_SORT) {
      TO_SORT.sort = true;
      TO_SORT.up = up;
    }
  }
}
