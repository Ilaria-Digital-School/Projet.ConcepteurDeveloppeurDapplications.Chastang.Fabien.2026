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
  @ViewChild('search') search!: ElementRef<HTMLInputElement>;

  // Constants
  public Common = Common;
  public Status = Status;

  // Native classes / Application services
  private userService = inject(UserService);
  private orderService = inject(OrderService);

  // Class properties
  users: User[] = [];
  orders: Order[] = [];
  filteredItems: any[] = [];
  filteredItemsByName: any[] = [];
  searchSubject: Subject<string> = new Subject<string>();
  selectedStatus: number = -1;

  // Initialize ///////////////////////////////////////////////////////////////

  ngOnInit() {
    // Load data
    this.load();

    // Search for users by email
    this.searchSubject
      .pipe(
        map((email: string) => {
          const EMAIL = email.toLowerCase();
          return this.users.filter((user: User) => {
            return user.email.toLowerCase().indexOf(EMAIL) === 0;
          });
        }),
      )
      .subscribe((res: User[]) => {
        // Retrieve these users' orders
        this.filterByUsers(res);

        // Filter by order status
        this.filterByStatus();
      });
  }

  // Load /////////////////////////////////////////////////////////////////////

  // Load data
  load() {
    // Retrieve all users before loading the orders
    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = res;
        this.loadOrders(); // Retrieve all orders
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Retrieve all orders
  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res: Order[]) => {
        this.orders = res;
        this.filteredItemsByName = res.map((order: Order) => {
          const USER = this.users.find((user: User) => user.id === order.userId);
          return { ...order, user: USER };
        });
        this.filteredItems = structuredClone(this.filteredItemsByName);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter ///////////////////////////////////////////////////////////////////

  // Retrieve orders for a list of users
  filterByUsers(users: User[]) {
    const USER_IDS = users.map((user: User) => user.id);

    this.filteredItemsByName = this.orders
      .filter((order: Order) => USER_IDS.includes(order.userId))
      .map((order: Order) => {
        const USER = users.find((user: User) => user.id === order.userId);
        return { ...order, user: USER };
      });
  }

  // Filter by order status
  filterByStatus() {
    this.filteredItems = this.filteredItemsByName.filter(
      (order: any) => this.selectedStatus === -1 || order.status === this.selectedStatus,
    );
  }

  // Search ///////////////////////////////////////////////////////////////////

  // Search for users by email
  searchItems(email: string) {
    this.searchSubject.next(email);
  }

  // Search for orders by status
  selectItems(select: any) {
    this.selectedStatus = Number(select.options[select.selectedIndex].value);
    this.filterByStatus();
  }
}
