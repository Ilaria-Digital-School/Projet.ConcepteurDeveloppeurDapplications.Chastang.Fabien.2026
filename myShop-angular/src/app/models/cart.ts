import { Common } from '../constants/common';
import { Product } from './product';

// Cart class
export class Cart {
  id: string = Common.getID();
  userId: string = '';
  products: Product[] = [];

  constructor(products: Product[] | null = null, userId: string | null = null) {
    if (typeof userId === 'string') this.userId = userId;

    if (Array.isArray(products)) {
      products.forEach((product: Product) => {
        const PRODUCT = this.products.find((item: Product) => item.id === product.id);
        if (PRODUCT) {
          if (typeof PRODUCT.cartQuantity === 'number') PRODUCT.cartQuantity++;
        } else {
          this.products.push(product);
        }
      });
    }
  }
}
