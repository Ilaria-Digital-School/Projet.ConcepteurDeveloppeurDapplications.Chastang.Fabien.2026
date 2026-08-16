import { Component, inject } from '@angular/core';
import { UsersTable } from '../users-table/users-table';
import { ProductsTable } from '../products-table/products-table';
import { OrdersTable } from '../orders-table/orders-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [UsersTable, ProductsTable, OrdersTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Native classes / Application services
  private router = inject(Router);

  // Class properties
  from: number = 0; // User tab

  ngOnInit() {
    // Origin of the page request
    if (this.router.url.includes('dashboard-product')) this.from = 1; // Product tab
    if (this.router.url.includes('dashboard-order')) this.from = 2; // Order tab
  }
}
