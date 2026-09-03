import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import { OrderService } from '../../services/order-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-add-order',
  imports: [],
  templateUrl: './add-order.html',
  styleUrl: './add-order.css',
})
export class AddOrder {
  // Native classes / Application services
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  // Class properties
  taxPercent: number = 20;
  userId!: string | null;
  userCart!: Cart;

  // Initialization ///////////////////////////////////////////////////////////

  ngOnInit() {
    // Get the user ID parameter
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    // Retrieve the user's cart
    const CART = localStorage.getItem('cart');
    if (CART) {
      const USER_CART = JSON.parse(CART).map((item: any) => {
        // Initialize the Product object with its methods
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
      this.userCart = new Cart(USER_CART);
    } else {
      this.userCart = new Cart();
    }

    // Initialize the user ID
    if (this.userId !== null) this.userCart.userId = this.userId;
  }

  // Actions //////////////////////////////////////////////////////////////////

  addOrder() {
    if (this.userCart.products.length > 0) {
      // Instantiate and initialize the 'Order' object
      const ORDER = new Order();
      ORDER.initialize(this.userCart, this.taxPercent);

      // Save the order
      this.orderService.addOrder(ORDER).subscribe({
        next: (res: Order) => {
          alert('Votre commande est enregistrée.');
          this.cartService.removeCart(); // Delete the user's cart
          this.router.navigate(['/']); // Redirecting to the homepage
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de l'enregistrement de votre commande.");
          console.log(err);
        },
      });
    }
  }
}
