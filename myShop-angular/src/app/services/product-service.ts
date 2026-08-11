import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../main';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Destination / Address
  productURL: string = 'http://localhost:3000/products';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of products)
  // getAllProducts() {
  //   return this.httpClient.get<Product[]>(this.productURL).pipe(
  //     map((products: Product[]) => {
  //       return products.map((product: Product) => {
  //         // Directly modify the attribute value
  //         product.name = product.name.toUpperCase();
  //         return product;
  //       });
  //     }),
  //   );
  // }

  // getAllProducts() {
  //   return this.httpClient.get<Product[]>(this.productURL).pipe(
  //     map((products: Product[]) => {
  //       return products.map((product: Product) => {
  //         // Adding a new property
  //         return {
  //           ...product,
  //           upperName: product.name.toUpperCase(),
  //         };
  //       });
  //     }),
  //   );
  // }

  getAllProducts() {
    return this.httpClient.get<Product[]>(this.productURL).pipe(
      map((products: Product[]) => {
        return products.map((product: Product) => {
          // Adding a new property
          product.additional = {
            priceTax: Math.round(product.price * 120) / 100, // +20%
            isAvailable: product.stock > 0,
          };
          return product;
        });
      }),
    );
  }

  // Response: product object or null
  getProductById(id: string | null) {
    return this.httpClient.get<Product>(`${this.productURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addProduct(product: Product) {
    return this.httpClient.post(this.productURL, product);
  }

  // Response: string, boolean, object + ID
  updateProduct(product: Product) {
    return this.httpClient.put(`${this.productURL}/${product.id}`, product);
  }

  // Response: string, boolean
  deleteProduct(id: string | null) {
    return this.httpClient.delete(`${this.productURL}/${id}`);
  }
}
