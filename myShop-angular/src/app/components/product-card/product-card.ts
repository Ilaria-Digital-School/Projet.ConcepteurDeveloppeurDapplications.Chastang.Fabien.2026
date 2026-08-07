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
  @Input() product: any;
  @Output() viewEvent = new EventEmitter();
  @Output() addEvent = new EventEmitter();

  // View a product
  view(id: string): void {
    this.viewEvent.emit(id);
  }

  // Add to cart
  add(product: Product) {
    this.addEvent.emit(product);
  }
}
