import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Product } from '../../../main';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  maxCount: number = 6;
  products: Product[] = [];

  // Initialize the product list
  ngOnInit(): void {
    this.load(true);
  }

  // Retrieve the products
  load(forceCheck: boolean = false): void {
    this.productService
      .getAllProducts()
      .pipe(take(this.maxCount))
      .subscribe({
        next: (res: Product[]) => {
          this.products = structuredClone(res);
          if (forceCheck) this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la récupération des données.");
          console.log(err);
        },
      });
  }

  // View a product
  view(id: string): void {
    this.router.navigate(['/products-carousel', id]);
  }
}
