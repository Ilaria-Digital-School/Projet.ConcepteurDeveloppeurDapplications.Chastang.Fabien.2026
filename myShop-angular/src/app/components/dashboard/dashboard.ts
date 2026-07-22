import { Component } from '@angular/core';
import { UsersTable } from '../users-table/users-table';
import { ProductsTable } from '../products-table/products-table';
import { OrdersTable } from '../orders-table/orders-table';

@Component({
  selector: 'app-dashboard',
  imports: [UsersTable, ProductsTable, OrdersTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
