import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Subject } from 'rxjs';
import { UserService } from '../../services/user-service';
import { OrderService } from '../../services/order-service';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { Common } from '../../constants/common';
import { Status } from '../../constants/status';

@Component({
  selector: 'app-table-orders',
  imports: [DatePipe, RouterLink],
  templateUrl: './table-orders.html',
  styleUrl: './table-orders.css',
})
export class TableOrders {
  // To retrieve DOM elements
  @ViewChild('searchEmail') searchEmail!: ElementRef<HTMLInputElement>;

  // Constants
  public Common = Common;
  public Status = Status;

  // Native classes / Application services
  private userService = inject(UserService);
  private orderService = inject(OrderService);

  // Class properties
  ordersUsers: any[] = [];
  filteredText: User[] = [];
  filteredItems: any[] = [];
  filteredByEmail: any[] = [];
  filteredByRef: User[] = [];
  searchByEmailSubject: Subject<string> = new Subject<string>();
  searchByRefSubject: Subject<string> = new Subject<string>();
  selectedStatus: number = -1;

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
            (order: any) => order.user.email.toLowerCase().indexOf(EMAIL) === 0,
          );
        }),
      )
      .subscribe((res: any[]) => {
        this.filteredByEmail = res;
        this.filteredText = res.filter((order: any) =>
          // Filter by order reference
          this.filteredByRef.some((item: any) => item.id === order.id),
        );
        this.filterByStatus(); // Filter by order status
      });

    // Search for orders by reference
    this.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.ordersUsers.filter((order: any) => order.reference.indexOf(REFERENCE) === 0);
        }),
      )
      .subscribe((res: User[]) => {
        this.filteredByRef = res;
        this.filteredText = res.filter((order: any) =>
          // Filter by user email
          this.filteredByEmail.some((item: any) => item.id === order.id),
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
        this.ordersUsers = res;
        this.loadUsers(); // Retrieve all users and associate all orders with their users
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Retrieve all users and associate all orders with their users
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        // All orders associate with their users
        this.ordersUsers = this.ordersUsers.map((order: Order) => {
          return { ...order, user: res.find((user: User) => user.id === order.userId) };
        });
        this.filteredByEmail = this.ordersUsers;
        this.filteredByRef = this.ordersUsers;
        this.filteredText = this.ordersUsers;
        this.filteredItems = this.ordersUsers;
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
        (order: any) => order.status === this.selectedStatus,
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

  // Search for orders by status
  selectStatusItems(select: any) {
    this.selectedStatus = Number(select.options[select.selectedIndex].value);
    this.filterByStatus();
  }
}
