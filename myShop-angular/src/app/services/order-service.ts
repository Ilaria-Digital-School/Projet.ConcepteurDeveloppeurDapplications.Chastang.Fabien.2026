import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.orders}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of orders)
  getAllOrders() {
    return this.httpClient.get<Order[]>(this.resourceURL).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.dateIns - order1.dateIns);
      }),
    );
  }

  // Response: array of objects (list of orders)
  getOrdersByUserId(userId: string | undefined): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.resourceURL}?userId=${userId}`).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.dateIns - order1.dateIns);
      }),
    );
  }

  // Response: array of objects (list of orders)
  getOrdersByUserIDs(userIDs: string[]): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.resourceURL}?userId=${userIDs.join('&userId=')}`).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort((order1: Order, order2: Order) => order2.dateIns - order1.dateIns);
      }),
    );
  }

  // Response: order object or null
  getOrderById(id: string | null): Observable<Order> {
    return this.httpClient.get<Order>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.dateIns = Date.now();
    return this.httpClient.post<Order>(this.resourceURL, ORDER);
  }

  // Response: string, boolean, object + ID
  updateOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.dateMod = Date.now();
    return this.httpClient.put<Order>(`${this.resourceURL}/${order.id}`, ORDER);
  }

  // Response: string, boolean, object + ID
  showOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.visible = true;
    return this.httpClient.put<Order>(`${this.resourceURL}/${order.id}`, ORDER);
  }

  // Response: string, boolean, object + ID
  hideOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSaveOrder(); // Remove these properties before saving the order
    ORDER.visible = false;
    return this.httpClient.put<Order>(`${this.resourceURL}/${order.id}`, ORDER);
  }

  // Response: string, boolean
  deleteOrder(id: string | null): Observable<Order> {
    return this.httpClient.delete<Order>(`${this.resourceURL}/${id}`);
  }
}
