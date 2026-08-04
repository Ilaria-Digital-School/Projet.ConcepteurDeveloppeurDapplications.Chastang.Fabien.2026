import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product: any;
  @Output() removeEvent = new EventEmitter();

  remove(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.removeEvent.emit(id);
    }
  }
}
