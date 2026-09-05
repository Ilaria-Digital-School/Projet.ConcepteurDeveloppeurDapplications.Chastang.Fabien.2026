import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve all orders
  getAllOrders() {
    return this.httpClient.get<Order[]>(Resources.ordersURL).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.dateIns - order1.dateIns);
      }),
    );
  }

  // Retrieve a user's orders using his ID
  getOrdersByUserId(userId: string | undefined): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${Resources.ordersURL}?userId=${userId}`).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.dateIns - order1.dateIns);
      }),
    );
  }

  // Retrieve a list of orders based on their IDs
  getOrdersByUserIDs(userIDs: string[]): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${Resources.ordersURL}?userId=${userIDs.join('&userId=')}`).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.dateIns - order1.dateIns);
      }),
    );
  }

  // Retrieve an order by its ID
  getOrderById(id: string | null): Observable<Order> {
    return this.httpClient.get<Order>(`${Resources.ordersURL}/${id}`);
  }

  // Add an order
  addOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.dateIns = Date.now();
    return this.httpClient.post<Order>(Resources.ordersURL, ORDER);
  }

  // Update an order
  updateOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.dateMod = Date.now();
    return this.httpClient.put<Order>(`${Resources.ordersURL}/${order.id}`, ORDER);
  }

  // Show an order
  showOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.visible = true;
    ORDER.dateHidden = null;
    return this.httpClient.put<Order>(`${Resources.ordersURL}/${order.id}`, ORDER);
  }

  // Hide an order
  hideOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.visible = false;
    ORDER.dateHidden = Date.now();
    return this.httpClient.put<Order>(`${Resources.ordersURL}/${order.id}`, ORDER);
  }

  // Delete an order
  deleteOrder(id: string | null): Observable<Order> {
    return this.httpClient.delete<Order>(`${Resources.ordersURL}/${id}`);
  }
}
