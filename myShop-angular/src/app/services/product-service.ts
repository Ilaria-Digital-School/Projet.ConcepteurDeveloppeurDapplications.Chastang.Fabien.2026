import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Destination / Address
  productURL: string = 'http://localhost:3000/products';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of products)
  getAllProducts() {
    return this.httpClient.get(this.productURL);
  }

  // Response: product object or null
  getProductById(id: string | null) {
    return this.httpClient.get(`${this.productURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addProduct(product: any) {
    return this.httpClient.post(this.productURL, product);
  }

  // Response: string, boolean
  deleteProduct(id: string | null) {
    return this.httpClient.delete(`${this.productURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  updateProduct(product: any) {
    return this.httpClient.put(this.productURL, product);
  }
}
