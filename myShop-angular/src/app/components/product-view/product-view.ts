import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-view',
  imports: [],
  templateUrl: './product-view.html',
  styleUrl: './product-view.css',
})
export class ProductView {
  private activatedRoute = inject(ActivatedRoute);

  productId!: number;
  products!: any[];
  product!: any;

  ngOnInit(): void {
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.products = JSON.parse(localStorage.getItem('products') || '[]');
      this.product = this.products.find((item: any) => (item.id = this.productId));
    }
  }
}
