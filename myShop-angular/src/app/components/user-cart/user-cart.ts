import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Common } from '../../constants/common';
import { Cart } from '../../models/cart';
import { OrderProduct } from '../../models/order-product';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { ProductService } from '../../services/product-service';

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
  private productService = inject(ProductService);

  // User messages
  private static msgDelProduct: string =
    'Êtes-vous sûr de vouloir retirer cet article de votre panier ?';
  private static msgDelCart: string = 'Êtes-vous sûr de vouloir supprimer votre panier ?';
  private static msgConnectToOrder: string =
    'Vous devez être connecté pour passer commande.\nSouhaitez-vous vous connecter ou vous inscrire ?';

  // Class properties
  taxPercent: number = 20;
  total: number = 0;
  userCart!: Cart;
  products: Product[] | null = [];
  connectedUser: User | null = null;

  // Initialize the Cart object and the view (template) ///////////////////////

  ngOnInit() {
    // Get the user if he is logged in
    this.getConnectedUser();

    const CART = localStorage.getItem('cart');
    if (CART) {
      this.userCart = new Cart(JSON.parse(CART));

      // Load the cart products
      this.productService.getProductsByIDs(this.userCart.getProductIDs()).subscribe({
        next: (res: Product[]) => {
          this.products = res
            .map((product: Product) => {
              const PRODUCT = this.userCart.products.find(
                (item: OrderProduct) => item.id === product.id,
              );
              // Initialize ONLY the quantity
              product.quantity = PRODUCT?.quantity;
              return product;
            })
            .sort((p1: Product, p2: Product) => {
              const COMPARE = p1.name.localeCompare(p2.name);
              return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
            });
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la récupération des données.");
          console.log(err);
        },
      });
    } else {
      this.userCart = new Cart();
    }
  }

  // Method to retrieve the logged-in user
  getConnectedUser() {
    this.connectedUser = this.authService.getConnectedUser();
  }

  // Product-related actions //////////////////////////////////////////////////

  // View a product
  view(id: string) {
    this.router.navigate(['/product-view', id]);
  }

  // Increase the quantity of a product
  addOne(product: Product) {
    // Add an item to the cart via CartService (local storage)
    this.cartService.add(new OrderProduct(product));

    // Update the cart view
    if (typeof product.quantity === 'number') product.quantity++;
  }

  // Decrease the quantity of a product
  removeOne(product: Product) {
    // Confirmation message only if the quantity in the cart is equal to 1
    if (product.quantity === 1 && !confirm(UserCart.msgDelProduct)) return;

    // Remove an item from the cart via CartService (local storage)
    this.cartService.remove(new OrderProduct(product));

    // Update the cart view
    if (product.quantity === 1) {
      this.userCart.products = this.userCart.products.filter(
        (item: OrderProduct) => item.id !== product.id,
      );
    } else if (typeof product.quantity === 'number') {
      product.quantity--;
    }
  }

  // Remove a product
  removeProduct(id: string) {
    // Confirmation message to remove a product
    if (!confirm(UserCart.msgDelProduct)) return;

    // Remove the product from the cart via CartService (local storage)
    this.cartService.removeProduct(id);

    // Remove the product from the cart view
    this.userCart.products = this.userCart.products.filter(
      (product: OrderProduct) => product.id !== id,
    );
  }

  // Cart-related actions /////////////////////////////////////////////////////

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
      this.router.navigate(['/user-login-cart']);
    }
  }
}
