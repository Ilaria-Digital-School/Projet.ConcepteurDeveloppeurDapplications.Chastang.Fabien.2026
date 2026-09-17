import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Order } from '../models/order';
import { Common } from '../constants/common';

function timestamp(date: string | number | Date): Number {
  return new Date(date).valueOf();
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve all orders
  getAllOrders() {
    return this.httpClient.get<Order[]>(Resources.ordersURL, Common.getHttpHeaders()).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort(
          (order1: Order, order2: Order) =>
            Common.timestamp(order2.dateIns) - Common.timestamp(order1.dateIns),
        );
      }),
    );
  }

  // Retrieve a user's orders using his ID
  getOrdersByUserId(userId: string | undefined): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${Resources.ordersURL}/${userId}/user`, Common.getHttpHeaders())
      .pipe(
        // Orders sorted from newest to oldest
        map((orders: Order[]) => {
          return orders.sort(
            (order1: Order, order2: Order) =>
              Common.timestamp(order2.dateIns) - Common.timestamp(order1.dateIns),
          );
        }),
      );
  }

  // Retrieve a list of orders based on their IDs
  getOrdersByIDs(IDs: string[]): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${Resources.ordersURL}/${IDs.join(',')}/list`, Common.getHttpHeaders())
      .pipe(
        // Orders sorted from newest to oldest
        map((orders: Order[]) => {
          return orders.sort(
            (order1: Order, order2: Order) =>
              Common.timestamp(order2.dateIns) - Common.timestamp(order1.dateIns),
          );
        }),
      );
  }

  // Retrieve an order by its ID
  getOrderById(id: string | undefined | null): Observable<Order> {
    return this.httpClient.get<Order>(`${Resources.ordersURL}/${id}`, Common.getHttpHeaders());
  }

  // Add an order
  addOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSave(); // Remove these properties before saving the Order
    return this.httpClient.post<Order>(Resources.ordersURL, ORDER, Common.getHttpHeaders());
  }

  // Update an order
  updateOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSave(); // Remove these properties before saving the Order
    return this.httpClient.put<Order>(
      `${Resources.ordersURL}/${order._id}`,
      ORDER,
      Common.getHttpHeaders(),
    );
  }

  // Show an order
  showOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSave(); // Remove these properties before saving the Order
    ORDER.visible = true;
    return this.httpClient.patch<Order>(
      `${Resources.ordersURL}/${order._id}/visible`,
      ORDER,
      Common.getHttpHeaders(),
    );
  }

  // Hide an order
  hideOrder(order: Order): Observable<Order> {
    const ORDER = order.removeBeforeSave(); // Remove these properties before saving the Order
    ORDER.visible = false;
    return this.httpClient.patch<Order>(
      `${Resources.ordersURL}/${order._id}/visible`,
      ORDER,
      Common.getHttpHeaders(),
    );
  }

  // Delete an order
  deleteOrder(id: string | undefined | null): Observable<Order> {
    return this.httpClient.delete<Order>(`${Resources.ordersURL}/${id}`, Common.getHttpHeaders());
  }
}
