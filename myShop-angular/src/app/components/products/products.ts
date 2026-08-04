import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../main';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';

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

  products!: Product[];

  // Retrieve the products
  load(forceCheck: boolean = false): void {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.map((item: any) => {
          const PRODUCT = new Product();
          Object.assign(PRODUCT, item);
          return PRODUCT;
        });
        if (forceCheck) this.changeDetectorRef.detectChanges(); // Force a check
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Initialize the product list
  ngOnInit(): void {
    this.load(true);
  }

  // View a product
  view(id: string): void {
    this.router.navigate(['/product-view', id]);
  }
}
