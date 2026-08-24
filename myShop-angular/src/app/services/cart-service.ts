import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // List of products in the cart
  cart = signal<Product[]>([]);

  constructor() {
    // Retrieve the user's cart
    const CART = localStorage.getItem('cart');

    if (CART) {
      // Initialize the signal property 'cart' (array of products)
      this.cart.set(
        JSON.parse(CART).map((item: any) => {
          const PRODUCT = new Product();
          Object.assign(PRODUCT, item);
          return PRODUCT;
        }),
      );
    }
  }

  // Add an item to the cart
  add(product: Product): void {
    this.cart.update((products: Product[]) => {
      // Initialize the product quantity to 1 if it is not defined
      if(product.cartQuantity === undefined) product.cartQuantity = 1;

      // Remove these properties that are unnecessary for the cart
      const PRODUCT = product.removeBeforeSaveCart();
      PRODUCT.cartQuantity = 1; // Reset the property to 1 if necessary

      const NEW_CART = [...products, PRODUCT];
      localStorage.setItem('cart', JSON.stringify(NEW_CART));
      return NEW_CART;
    });
  }

  // Remove an item from the cart
  remove(product: Product): void {
    this.cart.update((products: Product[]) => {
      const INDEX = products.findIndex((item: Product) => item.id === product.id);
      if (INDEX > -1) {
        products.splice(INDEX, 1);
        if (products.length === 0) {
          localStorage.removeItem('cart');
          return [];
        } else {
          const NEW_CART = structuredClone(products);
          localStorage.setItem('cart', JSON.stringify(NEW_CART));
          return NEW_CART;
        }
      } else {
        return products;
      }
    });
  }

  // Remove a product from the cart
  removeProduct(id: string): void {
    this.cart.update((products: Product[]) => {
      const NEW_CART = products.filter((product: Product) => product.id !== id);
      if (NEW_CART.length > 0) {
        localStorage.setItem('cart', JSON.stringify(NEW_CART));
        return NEW_CART;
      } else {
        localStorage.removeItem('cart');
        return [];
      }
    });
  }

  // Delete the user's cart
  removeCart(): void {
    localStorage.removeItem('cart');
    this.cart.set([]);
  }

  // Number of products in the cart
  cartCount = computed(() => {
    return this.cart().length;
  });
}
