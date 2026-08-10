import { Component } from '@angular/core';
import { UserOrder } from '../user-order/user-order';

@Component({
  selector: 'app-user-orders',
  imports: [UserOrder],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.css',
})
export class UserOrders {}
