import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../../main';

@Component({
  selector: 'app-products-table',
  imports: [],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
})
export class ProductsTable {
  private router = inject(Router);
  private productService = inject(ProductService);

  products!: Product[];

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.products = res.map((item:any) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
    });
  }

  view(id: number): void {
    this.router.navigate(['/product-view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/product-edit', id]);
  }

  remove(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      // Remove the product
      const PRODUCTS = this.products.filter((item: any) => item.id != id);
      // localStorage.setItem('products', JSON.stringify(PRODUCTS));

      // Refresh the product list
      this.products = PRODUCTS;
    }
  }
}
