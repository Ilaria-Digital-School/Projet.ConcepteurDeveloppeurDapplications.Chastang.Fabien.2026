import { Component, inject } from '@angular/core';
import { UserOrder } from '../user-order/user-order';
import { AuthService } from '../../services/auth-service';
import { OrderService } from '../../services/order-service';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  imports: [UserOrder],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.css',
})
export class UserOrders {
  // Native classes / Application services
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  // Class properties
  connectedUser!: User | null;
  orders: Order[] = [];

  // Initialize the properties to display the view
  ngOnInit() {
    // Retrieve the URL parameter if it exists
    const USER_ID = this.activatedRoute.snapshot.paramMap.get('id');

    let userId;
    if (USER_ID === null) {
      // If the parameter does not exist, get the user if he is logged in
      this.getConnectedUser();
      userId = this.connectedUser?.id;
    } else {
      userId = USER_ID;
    }

    // Retrieve user orders
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (res: Order[]) => {
        this.orders = res;
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
