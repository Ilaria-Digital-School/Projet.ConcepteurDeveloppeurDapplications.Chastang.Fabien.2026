import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../main';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Retrieve the product ////////////////////////////////////////////////

  productId!: string | null;
  product: Product = new Product();
  fullDescription: any[] = [];

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.productService.getProductById(this.productId).subscribe({
      next: (res: Product) => {
        Object.assign(this.product, res);
        if (this.product.fullDescription) {
          this.fullDescription = JSON.parse(this.product.fullDescription);
        }
        this.changeDetectorRef.detectChanges(); // Force a check
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  add(product: Product) {
    this.cartService.add(product);
  }
}
