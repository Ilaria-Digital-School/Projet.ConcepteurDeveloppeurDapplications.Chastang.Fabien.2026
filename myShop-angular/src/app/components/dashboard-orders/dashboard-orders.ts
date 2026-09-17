import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Common } from '../../constants/common';
import { Order } from '../../models/order';
import { StatusList } from '../../models/status';
import { DashboardHandle } from '../../models/dashboard';
import { OrderService } from '../../services/order-service';
import { UserService } from '../../services/user-service';

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

  // Native classes / Application services
  private userService = inject(UserService);
  private orderService = inject(OrderService);

  // Class properties grouped in the 'DashboardHandle' class
  dashboard: DashboardHandle<Order> = new DashboardHandle<Order>();
  orderStatus: StatusList = new StatusList();

  // Load and search //////////////////////////////////////////////////////////

  // Initialize order lists and search functions
  ngOnInit() {
    // Load all orders
    this.load();

    // Search for users by email
    this.dashboard.searchTextSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLocaleLowerCase();
          return this.dashboard.arrays.unfiltered.filter(
            (order: Order) => order.userId.email.toLowerCase().indexOf(EMAIL) === 0,
          );
        }),
      )
      .subscribe((res: Order[]) => {
        this.dashboard.arrays.filteredText = res;
        this.dashboard.arrays.filteredTextRef = res.filter((order: Order) =>
          // Filter by order reference
          this.dashboard.arrays.filteredRef.some((item: Order) => item._id === order._id),
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
            (order: Order) => order.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: Order[]) => {
        this.dashboard.arrays.filteredRef = res;
        this.dashboard.arrays.filteredTextRef = res.filter((order: Order) =>
          // Filter by user email
          this.dashboard.arrays.filteredText.some((item: Order) => item._id === order._id),
        );
        // Filter by order status
        this.filterStatus();
      });
  }

  // Retrieve all orders
  load() {
    this.orderService.getAllOrders().subscribe({
      next: (res: Order[]) => {
        // All orders
        this.dashboard.arrays.unfiltered = res
          .map((order: Order) => {
            const ORDER = new Order();
            Object.assign(ORDER, order);
            return ORDER;
          })
          .sort(
            (item1: Order, item2: Order) =>
              Common.timestamp(item2.dateIns) - Common.timestamp(item1.dateIns),
          );
        this.dashboard.arrays.filteredText = this.dashboard.arrays.unfiltered;
        this.dashboard.arrays.filteredRef = this.dashboard.arrays.unfiltered;
        this.dashboard.arrays.filteredTextRef = this.dashboard.arrays.unfiltered;
        this.dashboard.arrays.filteredItems = this.dashboard.arrays.unfiltered;
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
        (order: Order) => order.status === this.dashboard.selectedValue,
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

  // Sort orders by dateIns (default)
  sortByDate(array: Order[], up: boolean): Order[] {
    if (up) {
      return array.sort(
        (item1: Order, item2: Order) =>
          Common.timestamp(item1.dateIns) - Common.timestamp(item2.dateIns),
      );
    } else {
      return array.sort(
        (item1: Order, item2: Order) =>
          Common.timestamp(item2.dateIns) - Common.timestamp(item1.dateIns),
      );
    }
  }

  // Sort user orders by email
  sortByEmail(array: Order[], up: boolean): Order[] {
    if (up) {
      return array.sort((item1: Order, item2: Order) => {
        const COMPARE = item1.userId.email.localeCompare(item2.userId.email);
        return COMPARE === 0
          ? Common.timestamp(item1.dateIns) - Common.timestamp(item2.dateIns)
          : COMPARE;
      });
    } else {
      return array.sort((item1: Order, item2: Order) => {
        const COMPARE = item2.userId.email.localeCompare(item1.userId.email);
        return COMPARE === 0
          ? Common.timestamp(item2.dateIns) - Common.timestamp(item1.dateIns)
          : COMPARE;
      });
    }
  }

  // Sort orders by status
  sortByStatus(array: Order[], up: boolean): Order[] {
    if (up) {
      return array.sort((item1: Order, item2: Order) => {
        const COMPARE = item1.status - item2.status;
        return COMPARE === 0
          ? Common.timestamp(item1.dateIns) - Common.timestamp(item2.dateIns)
          : COMPARE;
      });
    } else {
      return array.sort((item1: Order, item2: Order) => {
        const COMPARE = item2.status - item1.status;
        return COMPARE === 0
          ? Common.timestamp(item2.dateIns) - Common.timestamp(item1.dateIns)
          : COMPARE;
      });
    }
  }
}
