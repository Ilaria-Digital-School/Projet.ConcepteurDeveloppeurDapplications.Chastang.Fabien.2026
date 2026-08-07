import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../main';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-products-carousel',
  imports: [ProductCard],
  templateUrl: './products-carousel.html',
  styleUrl: './products-carousel.css',
})
export class ProductsCarousel {
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

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

  add(product: Product) {
    this.cartService.add(product);
  }
}
