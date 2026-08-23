import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TableUsers } from '../table-users/table-users';
import { TableProducts } from '../table-products/table-products';
import { TableOrders } from '../table-orders/table-orders';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [TableUsers, TableProducts, TableOrders],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // To retrieve DOM elements
  @ViewChild('usersTable') usersTable!: TableUsers;
  @ViewChild('productsTable') productsTable!: TableProducts;
  @ViewChild('ordersTable') ordersTable!: TableOrders;

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
