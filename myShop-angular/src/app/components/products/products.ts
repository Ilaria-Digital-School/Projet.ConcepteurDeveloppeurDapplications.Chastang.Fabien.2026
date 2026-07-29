import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products!: any[];

  ngOnInit(): void {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
  }

  remove(id: number) {
    // Remove the product
    const PRODUCTS = this.products.filter((item: any) => item.id != id);
    localStorage.setItem('products', JSON.stringify(PRODUCTS));

    // Refresh the product list
    this.products = PRODUCTS;
  }
}
