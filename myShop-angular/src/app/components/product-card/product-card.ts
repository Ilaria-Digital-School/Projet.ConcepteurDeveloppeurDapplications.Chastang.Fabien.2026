import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  // View a product
  view(id: string): void {
    this.viewEvent.emit(id);
  }
}
