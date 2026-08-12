import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../main';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() isList: any;
  @Input() isSearch: any;
  @Input() product: any;
  @Output() viewEvent = new EventEmitter();
  @Output() addEvent = new EventEmitter();
  @Output() removeEvent = new EventEmitter();

  // View the carousel or the product details
  view(id: string) {
    this.viewEvent.emit(id);
  }

  // Add to cart
  addCart(product: Product) {
    this.addEvent.emit(product);
  }

  // Add to cart
  removeCart(product: Product) {
    this.removeEvent.emit(product);
  }
}
