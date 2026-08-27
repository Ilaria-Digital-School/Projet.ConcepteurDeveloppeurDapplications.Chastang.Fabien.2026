import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Common } from '../../constants/global/common';
import { OrderStatus } from '../../constants/order-status';
import { Product } from '../../models/product';

@Component({
  selector: 'app-user-order',
  imports: [DatePipe],
  templateUrl: './user-order.html',
  styleUrl: './user-order.css',
})
export class UserOrder {
  // Constants
  public Common = Common;
  public OrderStatus = OrderStatus;

  // To retrieve data from another component
  @Input() order: any;

  // Sort the product array alphabetically by name
  ngOnInit() {
    this.order.products = this.order.products.sort((p1: Product, p2: Product) => {
      const COMPARE = p1.name.localeCompare(p2.name);
      return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
    });
  }
}
