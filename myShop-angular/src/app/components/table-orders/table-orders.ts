import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Common } from '../../constants/common';
import { OrderExt } from '../../types/common';
import { DashboardHandle } from '../../models/dashboard';
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
  dashboard: DashboardHandle<OrderExt> = new DashboardHandle<OrderExt>();

  // Initialize ///////////////////////////////////////////////////////////////

  ngOnInit() {
    // Load data
    this.load();

    // Search for users by email
    this.dashboard.searchByTextSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLocaleLowerCase();
          return this.dashboard.arrays.unfiltered.filter(
            (orderExt: OrderExt) => orderExt.user?.email.toLowerCase().indexOf(EMAIL) === 0,
          );
        }),
      )
      .subscribe((res: OrderExt[]) => {
        this.dashboard.arrays.filteredByText = res;
        this.dashboard.arrays.filteredText = res.filter((orderExt: OrderExt) =>
          // Filter by order reference
          this.dashboard.arrays.filteredByRef.some(
            (item: OrderExt) => item.order.id === orderExt.order.id,
          ),
        );
        this.filterByValue(); // Filter by order status
      });

    // Search for orders by reference
    this.dashboard.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.dashboard.arrays.unfiltered.filter(
            (orderExt: OrderExt) => orderExt.order.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: OrderExt[]) => {
        this.dashboard.arrays.filteredByRef = res;
        this.dashboard.arrays.filteredText = res.filter((orderExt: OrderExt) =>
          // Filter by user email
          this.dashboard.arrays.filteredByText.some(
            (item: OrderExt) => item.order.id === orderExt.order.id,
          ),
        );
        this.filterByValue(); // Filter by order status
      });
  }

  // Initialize the dashboard.arrays that handle the sorting
  ngAfterViewInit() {
    // Defines the sorting elements: here, all attributes are fixed
    this.dashboard.sortElements = [
      { col: 'email', up: true, func: this.sortByEmail, HTMLCol: this.sortEmail.nativeElement },
      { col: 'date', up: false, func: this.sortByDate, HTMLCol: this.sortDate.nativeElement },
      { col: 'status', up: true, func: this.sortByStatus, HTMLCol: this.sortStatus.nativeElement },
    ];
    // Defines the sorting variables: 'sort' and/or 'up' are updated each time a sort is performed
    this.dashboard.sortVariables = [
      { col: 'email', sort: false, up: true },
      { col: 'date', sort: true, up: false },
      { col: 'status', sort: false, up: true },
    ];
    // Initialize the filter method
    this.dashboard.filterByValue = this.filterByValue;
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
        this.dashboard.arrays.unfiltered = orders
          .map((order: Order) => {
            return { order: order, user: res.find((user: User) => user.id === order.userId) };
          })
          .sort((item1: OrderExt, item2: OrderExt) => item2.order.date - item1.order.date);
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

  // Filter by order status
  filterByValue() {
    if (this.dashboard.selectedValue === -1) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredByText;
    } else {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredByText.filter(
        (orderExt: OrderExt) => orderExt.order.status === this.dashboard.selectedValue,
      );
    }
  }

  // Sort /////////////////////////////////////////////////////////////////////

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
