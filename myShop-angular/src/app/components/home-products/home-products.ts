import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-home-products',
  imports: [ProductCard],
  templateUrl: './home-products.html',
  styleUrl: './home-products.css',
})
export class HomeProducts {
  // Native classes / Application services
  private router = inject(Router);
  private productService = inject(ProductService);

  // Class properties
  maxCount: number = 6;
  products: Product[] = [];

  // Initialize the product list
  ngOnInit() {
    this.productService.getFirstProducts(this.maxCount).subscribe({
      next: (res: Product[]) => {
        this.products = res.sort((p1: Product, p2: Product) => {
          const COMPARE = p1.name.localeCompare(p2.name);
          return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
        });
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
