import { OrderProduct } from './order-product';
import { Product } from './product';

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

  // Add a product
  addOne(product: Product) {
    let quantity;
    const PRODUCT = this.products.find((item: OrderProduct) => item.id === product.id);
    if (PRODUCT) {
      PRODUCT.quantity++;
      quantity = PRODUCT.quantity;
    } else {
      const NEW_PRODUCT = new OrderProduct(product);
      quantity = NEW_PRODUCT.quantity = 1;
      this.products.push(NEW_PRODUCT);
    }
    product.quantity = quantity;
  }

  // Remove a product
  removeOne(product: Product) {
    let quantity;
    const INDEX = this.products.findIndex((item: OrderProduct) => item.id === product.id);
    if (INDEX > -1) {
      if (this.products[INDEX].quantity > 1) {
        this.products[INDEX].quantity--;
        quantity = this.products[INDEX].quantity;
      } else {
        this.products.splice(INDEX, 1);
        quantity = 0;
      }
    }
    product.quantity = quantity;
  }

  // Remove all occurrences of a product
  removeProduct(id: string) {
    this.products = this.products.filter((orderProduct: OrderProduct) => orderProduct.id !== id);
  }

  // Returns the list of product IDs for the cart
  getProductIDs(): string[] {
    return this.products.map((product: OrderProduct) => product.id);
  }

  // Rounded to two decimal places
  round(value: number): number {
    const POWER10 = 10 ** 2;
    return Math.round(POWER10 * value) / POWER10;
  }

  // Retrieve the total cart amount excluding tax
  getTotalExcludingTax(): number {
    const getTotal = (total: number, product: OrderProduct) => {
      return total + product.quantity * product.price;
    };
    return this.products.reduce(getTotal, 0);
  }
}
