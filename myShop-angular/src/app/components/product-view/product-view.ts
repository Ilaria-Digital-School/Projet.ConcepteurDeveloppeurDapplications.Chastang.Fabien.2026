import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../main';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-view',
  imports: [],
  templateUrl: './product-view.html',
  styleUrl: './product-view.css',
})
export class ProductView {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);

  productId!: number;
  products!: Product[];
  product: Product = new Product();

  ngOnInit(): void {
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.productService.getAllProducts().subscribe((res: any) => {
        this.products = res.map((item: any) => {
          const PRODUCT = new Product();
          Object.assign(PRODUCT, item);
          return PRODUCT;
        });
      });
      const PRODUCT = this.products.find((item: Product) => (item.id = this.productId));
      if (PRODUCT) Object.assign(this.product, PRODUCT);
    }
  }
}
