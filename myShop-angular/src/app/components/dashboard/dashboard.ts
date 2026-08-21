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
  @ViewChild('users') users!: TableUsers;
  @ViewChild('products') products!: TableProducts;
  @ViewChild('orders') orders!: TableOrders;

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
    this.users.search.nativeElement.focus();
  }

  productsFocus() {
    this.products.search.nativeElement.focus();
  }

  ordersFocus() {
    this.orders.search.nativeElement.focus();
  }
}
