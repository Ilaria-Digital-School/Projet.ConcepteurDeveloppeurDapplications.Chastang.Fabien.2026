import { Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../main';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(ProductService);

  products!: Product[];

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.products = res.map((item: any) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
    });
  }

  remove(id: number) {
    // Remove the product
    const PRODUCTS = this.products.filter((item: Product) => item.id != id);
    // localStorage.setItem('products', JSON.stringify(PRODUCTS));

    // Refresh the product list
    this.products = PRODUCTS;
  }
}
