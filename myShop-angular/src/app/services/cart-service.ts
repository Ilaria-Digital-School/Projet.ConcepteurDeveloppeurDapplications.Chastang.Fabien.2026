import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../main';

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

  // Add a product in the cart
  add(product: Product) {
    this.cart.update((products: Product[]) => {
      const NEW_CART = [...products, product];
      localStorage.setItem('cart', JSON.stringify(NEW_CART));
      return NEW_CART;
    });
  }

  // Number of products in the cart
  cartCount = computed(() => {
    return this.cart().length;
  });
}
