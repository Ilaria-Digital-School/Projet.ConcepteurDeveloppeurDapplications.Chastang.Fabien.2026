import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { Common } from '../../constants/common';
import { Cart } from '../../models/cart';
import { Product } from '../../models/product';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-cart',
  imports: [FormsModule],
  templateUrl: './user-cart.html',
  styleUrl: './user-cart.css',
})
export class UserCart {
  // Constants
  public Common = Common;

  // Native classes / Application services
  private router = inject(Router);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  // User messages
  private static msgDelProduct: string =
    'Êtes-vous sûr de vouloir retirer cet article de votre panier ?';
  private static msgDelCart: string = 'Êtes-vous sûr de vouloir supprimer votre panier ?';
  private static msgConnectToOrder: string =
    'Vous devez être connecté pour passer commande.\nSouhaitez-vous vous connecter ou vous inscrire ?';

  // Class properties
  tax: number = 1.2; // +20%
  total: number = 0;
  userCart!: Cart;
  connectedUser: User | null = null;

  // Initialize the Cart object and the view (template) ///////////////////////

  ngOnInit() {
    // Get the user if he is logged in
    this.getConnectedUser();

    const CART = localStorage.getItem('cart');
    if (CART) {
      const USER_CART = JSON.parse(CART).map((item: any) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
      this.userCart = new Cart(USER_CART);
    } else {
      this.userCart = new Cart();
    }
  }

  // Method to retrieve the logged-in user
  getConnectedUser() {
    this.connectedUser = this.authService.getConnectedUser();
  }

  // Product-related action ///////////////////////////////////////////////////

  // View a product
  view(id: string) {
    this.router.navigate(['/product-details', id]);
  }

  // Increase the quantity of a product
  addOne(product: Product) {
    // Add an item to the cart via CartService (local storage)
    this.cartService.add(product);

    // Update the cart view
    if (typeof product.cartQuantity === 'number') product.cartQuantity++;
  }

  // Decrease the quantity of a product
  removeOne(product: Product) {
    // Confirmation message only if the quantity in the cart is equal to 1
    if (product.cartQuantity === 1 && !confirm(UserCart.msgDelProduct)) return;

    // Remove an item from the cart via CartService (local storage)
    this.cartService.remove(product);

    // Update the cart view
    if (product.cartQuantity === 1) {
      this.userCart.products = this.userCart.products.filter(
        (item: Product) => item.id !== product.id,
      );
    } else if (typeof product.cartQuantity === 'number') {
      product.cartQuantity--;
    }
  }

  // Remove a product
  removeProduct(id: string) {
    // Confirmation message to remove a product
    if (!confirm(UserCart.msgDelProduct)) return;

    // Remove the product from the cart via CartService (local storage)
    this.cartService.removeProduct(id);

    // Remove the product from the cart view
    this.userCart.products = this.userCart.products.filter((product: Product) => product.id !== id);
  }

  // Cart-related action //////////////////////////////////////////////////////

  // Retrieve the total cart amount excluding tax
  getTotalExcludingTax() {
    return (this.total = this.userCart.getTotalExcludingTax());
  }

  // Delete the user's cart
  removeCart() {
    // Confirmation message to delete the user's cart
    if (!confirm(UserCart.msgDelCart)) return;

    // Delete the user's cart via CartService (local storage)
    this.cartService.removeCart();

    // Remove the cart from the view
    this.userCart.products = [];
  }

  // To order
  addOrder() {
    if (this.connectedUser) {
      this.router.navigate(['/add-order', this.connectedUser.id]);
    } else if (confirm(UserCart.msgConnectToOrder)) {
      this.router.navigate(['/login-cart']);
    }
  }
}
