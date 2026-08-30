import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Common } from '../../constants/common';
import { Product } from '../../models/product';
import { StatusList } from '../../models/status';

@Component({
  selector: 'app-user-order',
  imports: [DatePipe],
  templateUrl: './user-order.html',
  styleUrl: './user-order.css',
})
export class UserOrder {
  // Constants
  public Common = Common;

  // To retrieve data from another component
  @Input() order: any;

  // Class properties
  orderStatus: StatusList = new StatusList();

  // Sort the product array alphabetically by name
  ngOnInit() {
    this.order.products = this.order.products.sort((p1: Product, p2: Product) => {
      const COMPARE = p1.name.localeCompare(p2.name);
      return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
    });
  }
}
