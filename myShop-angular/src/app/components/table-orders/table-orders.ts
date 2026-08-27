import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Common } from '../../constants/global/common';
import { OrderExt, SortElement, SortVariables } from '../../constants/global/types';
import { OrderStatus } from '../../constants/order-status';
import { UserService } from '../../services/user-service';
import { OrderService } from '../../services/order-service';
import { Order } from '../../models/order';
import { User } from '../../models/user';

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
  public OrderStatus = OrderStatus;

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
  // Used for sorting
  sortElements!: SortElement[];
  sortVariables!: SortVariables[];

  // Initialize ///////////////////////////////////////////////////////////////

  ngOnInit() {
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

  // Initialize the arrays that handle the sorting
  ngAfterViewInit() {
    // Defines the sorting elements: here, all attributes are fixed
    this.sortElements = [
      { col: 'email', up: true, func: this.sortByEmail, HTMLCol: this.sortEmail.nativeElement },
      { col: 'date', up: false, func: this.sortByDate, HTMLCol: this.sortDate.nativeElement },
      { col: 'status', up: true, func: this.sortByStatus, HTMLCol: this.sortStatus.nativeElement },
    ];
    // Defines the sorting variables: 'sort' and/or 'up' are updated each time a sort is performed
    this.sortVariables = [
      { col: 'email', sort: false, up: true },
      { col: 'date', sort: true, up: false },
      { col: 'status', sort: false, up: true },
    ];
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

  // Sort all arrays
  sort(column: string) {
    Common.sort(
      [
        this.ordersUsers,
        this.filteredByEmail,
        this.filteredByRef,
        this.filteredText,
        this.filteredItems,
      ],
      this.sortElements,
      this.sortVariables,
      column,
    );
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
}
