import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private authService = inject(AuthService);
  isAdmin!: boolean;

  @Input() isView: any;
  @Input() product: any;
  @Output() viewEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() removeEvent = new EventEmitter();

  // Initialize the flag
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  // View a product
  view(id: string): void {
    this.viewEvent.emit(id);
  }

  // Edit a product
  edit(id: string): void {
    this.editEvent.emit(id);
  }

  // Delete a product
  remove(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.removeEvent.emit(id);
    }
  }
}
