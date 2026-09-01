import { OrderProduct } from './order-product';

// 'Cart' object initialized from the list of products with a
// quantity of 1 for each item; list stored in local storage
export class Cart {
  // Class properties
  id: string = '';
  userId: string = '';
  products: OrderProduct[] = [];

  constructor(products: OrderProduct[] | null = null, userId: string | null = null) {
    if (typeof userId === 'string') this.userId = userId;

    // Initializing the product list where each product appears
    // only once, but the quantity can be greater than 1
    if (Array.isArray(products)) {
      products.forEach((product: OrderProduct) => {
        const PRODUCT = this.products.find((item: OrderProduct) => item.id === product.id);
        if (PRODUCT) {
          PRODUCT.quantity++;
        } else {
          product.quantity = 1;
          this.products.push(product);
        }
      });
    }
  }

  // Returns the list of product IDs for the cart
  getProductIDs(): string[] {
    return this.products.map((product: OrderProduct) => product.id);
  }

  // Retrieve the total cart amount excluding tax
  getTotalExcludingTax(): number {
    const getTotal = (total: number, product: OrderProduct) => {
      return (
        total +
        (typeof product.quantity === 'number' ? product.quantity * product.price : 0)
      );
    };
    return this.products.reduce(getTotal, 0);
  }
}
