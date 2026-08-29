import { Component, inject, ViewChild } from '@angular/core';
import { DashboardUsers } from '../dashboard-users/dashboard-users';
import { DashboardProducts } from '../dashboard-products/dashboard-products';
import { DashboardOrders } from '../dashboard-orders/dashboard-orders';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardUsers, DashboardProducts, DashboardOrders],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // To retrieve DOM elements
  @ViewChild('usersTable') usersTable!: DashboardUsers;
  @ViewChild('productsTable') productsTable!: DashboardProducts;
  @ViewChild('ordersTable') ordersTable!: DashboardOrders;

  // Native classes / Application services
  private router = inject(Router);

  // Class properties
  from: number = 0; // User tab

  ngOnInit() {
    // Origin of the page request
    if (this.router.url.includes('dashboard-product')) this.from = 1; // Product tab
    if (this.router.url.includes('dashboard-order')) this.from = 2; // Order tab
  }

  ngAfterViewInit() {
    this.usersFocus();
  }

  usersFocus() {
    this.usersTable.emailUsers.nativeElement.focus();
  }

  productsFocus() {
    this.productsTable.nameProducts.nativeElement.focus();
  }

  ordersFocus() {
    this.ordersTable.emailOrders.nativeElement.focus();
  }
}
