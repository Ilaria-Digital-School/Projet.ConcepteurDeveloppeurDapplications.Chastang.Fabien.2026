import { Component, inject } from '@angular/core';
import { Product, Cart, User } from '../../../main';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-cart',
  imports: [FormsModule],
  templateUrl: './user-cart.html',
  styleUrl: './user-cart.css',
})
export class UserCart {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tax: number = 1.2; // +20%
  userCart!: Cart;
  productsIni!: Product[];
  cart!: string;
  connectedUser: User | null = null;

  // Initialize the Cart object and the view (template)
  ngOnInit() {
    // Get the user if he is logged in
    this.getConnectedUser();

    const CART = localStorage.getItem('cart');
    if (CART) {
      this.cart = CART;
      const USER_CART = JSON.parse(CART).map((item: any) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
      this.userCart = new Cart(USER_CART);
      this.productsIni = structuredClone(this.userCart.products);
    } else {
      this.userCart = new Cart();
    }
  }

  // Method to retrieve the logged-in user
  getConnectedUser() {
    this.connectedUser = this.authService.getConnectedUser();
  }

  // Increase the quantity of a product
  addOne(product: Product) {
    // Add the product to local storage via CartService
    const PRODUCT = new Product();
    Object.assign(PRODUCT, product);
    PRODUCT.cartQuantity = 1;
    this.cartService.add(PRODUCT);

    // Update the cart view
    product.cartQuantity++;
  }

  // Decrease the quantity of a product
  removeOne(product: Product) {
    // Remove the product or decrease its quantity in local storage
    this.cartService.remove(product);

    // Update the cart view
    if (product.cartQuantity === 1) {
      this.userCart.products = this.userCart.products.filter(
        (item: Product) => item.id !== product.id,
      );
    } else {
      product.cartQuantity--;
    }
  }

  removeProduct(id: string) {
    // Remove the product from the local storage
    this.cartService.removeProduct(id);

    // Remove the product from the cart view
    this.userCart.products = this.userCart.products.filter((product: Product) => product.id !== id);
  }

  // Retrieve the total cart amount excluding tax
  getTotalExcludingTax() {
    return this.userCart.products.reduce((total: number, product: Product) => {
      return total + product.cartQuantity * product.price;
    }, 0);
  }

  // Retrieve the total cart amount including taxes
  getTotalIncludingTax() {
    return this.userCart.products.reduce((total: number, product: Product) => {
      return total + product.cartQuantity * product.price * this.tax;
    }, 0);
  }

  // Remove the cart
  removeCart() {
    // Remove the cart from the local storage
    this.cartService.removeCart();

    // Remove the cart from the view
    this.userCart.products = [];
  }

  // Place the order
  addOrder() {
    if (this.connectedUser) {
      this.router.navigate(['/add-order', this.connectedUser.id]);
    } else if (
      confirm(
        'Vous devez être connecté pour passer commande.\nSouhaitez-vous vous connecter ou vous inscrire ?',
      )
    ) {
      this.router.navigate(['/login-cart']);
    }
  }
}
