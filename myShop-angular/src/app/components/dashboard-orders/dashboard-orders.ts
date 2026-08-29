import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ItemCst } from '../../types/items';
import { OrderExt } from '../../types/common';
import { Common } from '../../constants/common';
import { OrderStatus } from '../../constants/order-status';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { DashboardHandle } from '../../models/dashboard';
import { UserService } from '../../services/user-service';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-dashboard-orders',
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard-orders.html',
  styleUrl: './dashboard-orders.css',
})
export class DashboardOrders {
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

  // Class properties grouped in the 'DashboardHandle' class
  dashboard: DashboardHandle<OrderExt> = new DashboardHandle<OrderExt>();
  orderStatus!: ItemCst[];

  // Load and search //////////////////////////////////////////////////////////

  // Initialize order lists and search functions
  ngOnInit() {
    // Sort the order's status
    this.orderStatus = OrderStatus.list.sort((i1: ItemCst, i2: ItemCst) => i1.value - i2.value);

    // Load all orders
    this.load();

    // Search for users by email
    this.dashboard.searchTextSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLocaleLowerCase();
          return this.dashboard.arrays.unfiltered.filter(
            (orderExt: OrderExt) => orderExt.user?.email.toLowerCase().indexOf(EMAIL) === 0,
          );
        }),
      )
      .subscribe((res: OrderExt[]) => {
        this.dashboard.arrays.filteredText = res;
        this.dashboard.arrays.filteredTextRef = res.filter((orderExt: OrderExt) =>
          // Filter by order reference
          this.dashboard.arrays.filteredRef.some(
            (item: OrderExt) => item.order.id === orderExt.order.id,
          ),
        );
        // Filter by order status
        this.filterStatus();
      });

    // Search for orders by reference
    this.dashboard.searchRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.dashboard.arrays.unfiltered.filter(
            (orderExt: OrderExt) => orderExt.order.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: OrderExt[]) => {
        this.dashboard.arrays.filteredRef = res;
        this.dashboard.arrays.filteredTextRef = res.filter((orderExt: OrderExt) =>
          // Filter by user email
          this.dashboard.arrays.filteredText.some(
            (item: OrderExt) => item.order.id === orderExt.order.id,
          ),
        );
        // Filter by order status
        this.filterStatus();
      });
  }

  // Retrieve all orders before loading the users
  load() {
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
        this.dashboard.arrays.filteredText = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredRef = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredTextRef = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredItems = structuredClone(this.dashboard.arrays.unfiltered);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by order status
  filterStatus() {
    if (this.dashboard.selectedValue === -1) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredTextRef;
    } else {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredTextRef.filter(
        (orderExt: OrderExt) => orderExt.order.status === this.dashboard.selectedValue,
      );
    }
  }

  // Search by order status
  selectStatus(select: any) {
    this.dashboard.selectedValue = Number(select.options[select.selectedIndex].value);
    this.filterStatus();
  }

  // Sort /////////////////////////////////////////////////////////////////////

  // Initialize sorting
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
  }

  // Sort orders by date (default)
  sortByDate(array: OrderExt[], up: boolean): OrderExt[] {
    if (up) {
      return array.sort((item1: OrderExt, item2: OrderExt) => item1.order.date - item2.order.date);
    } else {
      return array.sort((item1: OrderExt, item2: OrderExt) => item2.order.date - item1.order.date);
    }
  }

  // Sort user orders by email
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

  // Sort orders by status
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
