import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  // Retrieve the product ////////////////////////////////////////////////

  productId!: string | null;
  product: Product = new Product();

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.productService.getProductById(this.productId).subscribe({
      next: (res: Product) => {
        Object.assign(this.product, res);
        this.changeDetectorRef.detectChanges(); // Force a check
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
