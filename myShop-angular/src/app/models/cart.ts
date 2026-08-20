import { Common } from '../constants/common';
import { Product } from './product';

// 'Cart' object initialized from the list of products with a
// quantity of 1 for each item; list stored in local storage
export class Cart {
  id: string = Common.getID();
  userId: string = '';
  products: Product[] = [];

  constructor(products: Product[] | null = null, userId: string | null = null) {
    if (typeof userId === 'string') this.userId = userId;

    // Initializing the product list where each product appears
    // only once, but the quantity can be greater than 1
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

  // Retrieve the total cart amount excluding tax
  getTotalExcludingTax(): number {
    const getTotal = (total: number, product: Product) => {
      return (
        total +
        (typeof product.cartQuantity === 'number' ? product.cartQuantity * product.price : 0)
      );
    };
    return this.products.reduce(getTotal, 0);
  }
}
