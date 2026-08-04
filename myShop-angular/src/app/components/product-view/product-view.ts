import { Component, inject } from '@angular/core';
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
  private productService = inject(ProductService);

  productId!: string | null;
  product: Product = new Product();

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.productId);
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (res: Object) => {
          Object.assign(this.product, res);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
    console.log(this.product.id);
  }

  remove(id: number) {}
}
