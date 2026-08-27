import { Product } from './product';

// 'Cart' object initialized from the list of products with a
// quantity of 1 for each item; list stored in local storage
export class Cart {
  id: string = '';
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
          if (typeof PRODUCT.cartQuantity === 'number') PRODUCT.cartQuantity++; // Increment the quantity
        } else {
          product.cartQuantity = 1; // Initialize the quantity
          this.products.push(product);
        }
      });

      // Sort the product array alphabetically by name
      this.products = this.products.sort((p1: Product, p2: Product) => {
        const COMPARE = p1.name.localeCompare(p2.name);
        return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
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
