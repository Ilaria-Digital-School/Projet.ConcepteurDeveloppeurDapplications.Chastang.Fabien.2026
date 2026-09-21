import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Order } from '../models/order';
import { HTTPHeaders, Common } from '../constants/common';

function timestamp(date: string | number | Date): Number {
  return new Date(date).valueOf();
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.ordersURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // Retrieve all orders
  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.url, this.httpHeaders).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort(
          (o1: Order, o2: Order) => Common.timestamp(o2.dateIns) - Common.timestamp(o1.dateIns),
        );
      }),
    );
  }

  // Retrieve a user's orders using his ID
  getOrdersByUserId(userId: string | undefined): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.url}/${userId}/user`, this.httpHeaders).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort(
          (o1: Order, o2: Order) => Common.timestamp(o2.dateIns) - Common.timestamp(o1.dateIns),
        );
      }),
    );
  }

  // Retrieve a list of orders based on their IDs
  getOrdersByIDs(IDs: string[]): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.url}/${IDs.join(',')}/list`, this.httpHeaders).pipe(
      // Orders sorted from newest to oldest
      map((orders: Order[]) => {
        return orders.sort(
          (o1: Order, o2: Order) => Common.timestamp(o2.dateIns) - Common.timestamp(o1.dateIns),
        );
      }),
    );
  }

  // Retrieve an order by its ID
  getOrderById(id: string | undefined | null): Observable<Order> {
    return this.httpClient.get<Order>(`${this.url}/${id}`, this.httpHeaders);
  }

  // Add an order
  addOrder(order: Order): Observable<Order> {
    // Remove these properties before saving the Order
    const ORDER = order.removeBeforeSave();
    return this.httpClient.post<Order>(this.url, ORDER, this.httpHeaders);
  }

  // Update an order
  updateOrder(order: Order): Observable<Order> {
    // Remove these properties before saving the Order
    const ORDER = order.removeBeforeSave();
    return this.httpClient.put<Order>(`${this.url}/${order._id}`, ORDER, this.httpHeaders);
  }

  // Show an order
  showOrder(order: Order): Observable<Order> {
    // Remove these properties before saving the Order
    const ORDER = order.removeBeforeSave();
    // Show the item
    ORDER.visible = true;
    const URL = `${this.url}/${order._id}/visible`;
    return this.httpClient.patch<Order>(URL, ORDER, this.httpHeaders);
  }

  // Hide an order
  hideOrder(order: Order): Observable<Order> {
    // Remove these properties before saving the Order
    const ORDER = order.removeBeforeSave();
    // Hide the item
    ORDER.visible = false;
    const URL = `${this.url}/${order._id}/visible`;
    return this.httpClient.patch<Order>(URL, ORDER, this.httpHeaders);
  }

  // Delete an order
  deleteOrder(id: string | undefined | null): Observable<Order> {
    return this.httpClient.delete<Order>(`${this.url}/${id}`, this.httpHeaders);
  }
}
