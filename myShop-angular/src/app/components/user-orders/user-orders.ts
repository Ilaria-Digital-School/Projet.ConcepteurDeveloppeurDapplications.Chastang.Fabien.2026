import { Component, inject } from '@angular/core';
import { UserOrder } from '../user-order/user-order';
import { AuthService } from '../../services/auth-service';
import { OrderService } from '../../services/order-service';
import { User } from '../../models/user';
import { Order } from '../../models/order';

@Component({
  selector: 'app-user-orders',
  imports: [UserOrder],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.css',
})
export class UserOrders {
  // Native classes / Application services
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  // Class properties
  connectedUser!: User | null;
  orders: Order[] = [];

  // Initialize the properties to display the view
  ngOnInit() {
    // Get the user if he is logged in
    this.getConnectedUser();

    // Retrieve user orders
    this.orderService.getOrdersByUserId(this.connectedUser?.id).subscribe({
      next: (res: Order[]) => {
        this.orders = structuredClone(res);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Method to retrieve the logged-in user
  getConnectedUser() {
    this.connectedUser = this.authService.getConnectedUser();
  }
}
