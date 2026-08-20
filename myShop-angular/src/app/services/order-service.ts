import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Destination / Address
  orderURL: string = 'http://localhost:3000/orders';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of orders)
  getAllOrders() {
    return this.httpClient.get<Order[]>(this.orderURL).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.date - order1.date);
      }),
    );
  }

  // Response: array of objects (list of orders)
  getOrdersByUserId(userId: string | undefined): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.orderURL}?userId=${userId}`).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.date - order1.date);
      }),
    );
  }

  // Response: order object or null
  getOrderById(id: string | null): Observable<Order> {
    return this.httpClient.get<Order>(`${this.orderURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    return this.httpClient.post<Order>(this.orderURL, ORDER);
  }

  // Response: string, boolean, object + ID
  updateOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    return this.httpClient.put<Order>(`${this.orderURL}/${order.id}`, ORDER);
  }

  // Response: string, boolean
  deleteOrder(id: string | null): Observable<Order> {
    return this.httpClient.delete<Order>(`${this.orderURL}/${id}`);
  }
}
