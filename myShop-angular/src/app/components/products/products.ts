import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';
import { take } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  // Native classes / Application services
  private router = inject(Router);
  private productService = inject(ProductService);

  // Class properties
  maxCount: number = 6;
  products: Product[] = [];

  // Initialize the product list
  ngOnInit() {
    this.load();
  }

  // Retrieve the products
  load() {
    this.productService
      .getAllProducts()
      .pipe(take(this.maxCount))
      .subscribe({
        next: (res: Product[]) => {
          this.products = structuredClone(res);
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la récupération des données.");
          console.log(err);
        },
      });
  }

  // View a product
  view(id: string) {
    this.router.navigate(['/products-carousel', id]);
  }
}
