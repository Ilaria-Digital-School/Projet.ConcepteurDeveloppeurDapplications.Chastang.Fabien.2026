import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
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
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  // Class properties
  taxPercent: number = 20;
  userCart!: Cart;

  // Initialization ///////////////////////////////////////////////////////////

  ngOnInit(): void {
    // Retrieve the user's cart
    const CART = localStorage.getItem('cart');
    if (CART) {
      this.userCart = new Cart(JSON.parse(CART));
    } else {
      this.userCart = new Cart();
    }
  }

  // Actions //////////////////////////////////////////////////////////////////

  submit(): void {
    if (this.userCart.products.length > 0) {
      // Instantiate and initialize the 'Order' object
      const ORDER = new Order();
      ORDER.initialize(this.userCart, this.taxPercent);

      console.log(ORDER);

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
