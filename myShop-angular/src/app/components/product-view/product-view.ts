import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Common } from '../../constants/common';
import { Product, FullDesc } from '../../models/product';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { OrderProduct } from '../../models/order-product';

@Component({
  selector: 'app-product-view',
  imports: [],
  templateUrl: './product-view.html',
  styleUrl: './product-view.css',
})
export class ProductView {
  // Constants
  public Common = Common;

  // Native classes / Application services
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Class properties
  productId!: string | null;
  product: Product = new Product();
  fullDescription: FullDesc[] = [];

  // Initialization ///////////////////////////////////////////////////////////

  // Initialize the view
  ngOnInit() {
    // Retrieve the product ID
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    // Get the product data
    this.productService.getProductById(this.productId).subscribe({
      next: (res: Product) => {
        Object.assign(this.product, res);

        if (this.product.fullDescription)
          this.fullDescription = this.getFullDescription(this.product.fullDescription);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // 'fullDescription' has the following structure:
  // [
  //   {
  //     title: "title 1", // optional
  //     description: [
  //       "paragraph 1",
  //       "paragraph 2",
  //       ...
  //     ]
  //   },
  //   {
  //     title: "title 2", // optional
  //     description: [
  //       "paragraph 1",
  //       ...
  //     ]
  //   },
  //   ...
  // ]

  getFullDescription(description: string): FullDesc[] {
    const RESULT: FullDesc[] = [];
    const RE_TITLE = /^\s{0,}\${2,}\s{0,}/;
    const DESCRIPTION = description
      .split('\n')
      .map((value: string) => {
        return value.trim();
      })
      .filter((value: string) => value !== '');

    let objDesc: FullDesc | null = null;
    DESCRIPTION.forEach((value: string) => {
      const IS_TITLE = RE_TITLE.test(value);

      if (objDesc === null || IS_TITLE) {
        if (objDesc !== null) RESULT.push(objDesc);

        const TITLE = IS_TITLE ? value.replace(RE_TITLE, '') : '';
        if (TITLE) {
          objDesc = {
            title: TITLE,
            description: [],
          };
        } else {
          objDesc = { title: undefined, description: [value] };
        }
      } else {
        objDesc.description.push(value);
      }
    });
    if (objDesc !== null) RESULT.push(objDesc);

    return RESULT;
  }

  // Actions //////////////////////////////////////////////////////////////////

  // Add the product to the user's cart
  addOne(product: Product) {
    this.cartService.addOne(new OrderProduct(product));
  }

  // Remove the product from the user's cart
  removeOne(product: Product) {
    this.cartService.removeOne(new OrderProduct(product));
  }
}
