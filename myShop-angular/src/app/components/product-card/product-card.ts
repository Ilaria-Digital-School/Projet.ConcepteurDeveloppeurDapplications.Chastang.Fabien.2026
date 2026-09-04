import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { Common } from '../../constants/common';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  // Constants
  public Common = Common;

  // To retrieve data from another component
  @Input() isList: any;
  @Input() isSearch: any;
  @Input() product: any;

  // To send an event to another component
  @Output() viewEvent = new EventEmitter();
  @Output() addOneEvent = new EventEmitter();
  @Output() removeOneEvent = new EventEmitter();

  // View the carousel or the product details
  view(id: string) {
    this.viewEvent.emit(id);
  }

  // Add to cart
  addOne(product: Product) {
    this.addOneEvent.emit(product);
  }

  // Add to cart
  removeOne(product: Product) {
    this.removeOneEvent.emit(product);
  }
}
