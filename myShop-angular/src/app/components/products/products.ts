import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products!: any[];

  ngOnInit(): void {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
  }
}
