import { computed, Injectable, signal } from '@angular/core';
import { OrderProduct } from '../models/order-product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // List of products in the cart
  cart = signal<OrderProduct[]>([]);

  // Number of products in the cart
  cartCount = computed(() => {
    return this.cart().length;
  });

  constructor() {
    // Retrieve the user's cart
    const CART = localStorage.getItem('cart');

    // Initialize the signal property 'cart' (array of products)
    if (CART) this.cart.set(JSON.parse(CART));
  }

  // Add an item to the cart
  addOne(product: OrderProduct): void {
    this.cart.update((products: OrderProduct[]) => {
      // Remove the properties that are not necessary for the shopping cart
      const NEW_CART = [...products, product];
      localStorage.setItem('cart', JSON.stringify(NEW_CART));
      return NEW_CART;
    });
  }

  // Remove an item from the cart
  removeOne(product: OrderProduct): void {
    this.cart.update((products: OrderProduct[]) => {
      const INDEX = products.findIndex((item: OrderProduct) => item.id === product.id);
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
    this.cart.update((products: OrderProduct[]) => {
      const NEW_CART = products.filter((product: OrderProduct) => product.id !== id);
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
}
