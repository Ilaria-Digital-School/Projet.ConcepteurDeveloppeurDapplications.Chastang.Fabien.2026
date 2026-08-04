import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../main';
import { ProductService } from '../../services/product-service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-view',
  imports: [ProductCard],
  templateUrl: './product-view.html',
  styleUrl: './product-view.css',
})
export class ProductView {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  productId!: string | null;
  product: Product = new Product();

  // Retrieve the product
  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (res: Object) => {
          Object.assign(this.product, res);
          this.changeDetectorRef.detectChanges(); // Force a check
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  // Edit a product
  edit(id: string): void {
    this.router.navigate(['/product-edit', id]);
  }

  // Delete a product
  remove(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      // Remove the product
      this.productService.deleteProduct(id).subscribe({
        next: (res: Object) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la suppression.");
          console.log(err);
        },
      });
    }
  }
}
