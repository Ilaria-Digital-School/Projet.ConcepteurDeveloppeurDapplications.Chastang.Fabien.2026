import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-table',
  imports: [],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
})
export class ProductsTable {
  constructor(private router: Router) {}

  products!: any[];

  ngOnInit(): void {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
  }

  view(id: number): void {
    this.router.navigate(['/product-view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/product-edit', id]);
  }

  remove(id: number): void {
    // Remove the product
    const PRODUCTS = this.products.filter((item: any) => item.id != id);
    localStorage.setItem('products', JSON.stringify(PRODUCTS));

    // Refresh the product list
    this.products = PRODUCTS;
  }
}
