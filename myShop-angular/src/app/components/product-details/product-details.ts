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

  // Initialize the card
  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.productService.getProductById(this.productId).subscribe({
      next: (res: Product) => {
        Object.assign(this.product, res);
        if (this.product.fullDescription) {
          this.fullDescription = this.getFullDescription(this.product.fullDescription);
        }
        this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
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

  getFullDescription(description: string) {
    const RESULT: any[] = [];
    const RE_TITLE = /^\s{0,}\${2,}\s{0,}/;
    const DESCRIPTION: string[] = description
      .split('\n')
      .map((value: string) => {
        return value.trim();
      })
      .filter((value: string) => value !== '');

    let objDesc: any = null;
    DESCRIPTION.forEach((value: string) => {
      const IS_TITLE: boolean = RE_TITLE.test(value);

      if (objDesc === null || IS_TITLE) {
        if (objDesc !== null) RESULT.push(objDesc);

        const TITLE: string = IS_TITLE ? value.replace(RE_TITLE, '') : '';
        if (TITLE) {
          objDesc = {
            title: TITLE,
            description: [],
          };
        } else {
          objDesc = { description: [value] };
        }
      } else {
        objDesc.description.push(value);
      }
    });
    if (objDesc !== null) RESULT.push(objDesc);

    return RESULT;
  }

  // Add the product to the user's cart
  addCart(product: Product) {
    this.cartService.add(product);
  }

  // Remove the product from the user's cart
  removeCart(product: Product) {
    this.cartService.remove(product);
  }
}
