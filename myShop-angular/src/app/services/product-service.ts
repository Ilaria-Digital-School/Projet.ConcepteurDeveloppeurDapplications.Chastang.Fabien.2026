import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Destination / Address
  productURL: string = 'http://localhost:3000/products';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of products)
  getAllProducts(taxPercent: number = 20): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productURL).pipe(
      map((products: Product[]) => {
        return products.map((product: Product) => {
          //  // 1 - Directly modify the attribute value
          //  product.name = product.name.toUpperCase();
          //
          //  // 2 - Adding a new property
          //  return {
          //    ...product,
          //    upperName: product.name.toUpperCase(),
          //  };

          // 3 - Adding a new property and preserving the type 'Product'
          product.additional = {
            priceTax: (1 + taxPercent / 100) * product.price, // +20%
            isAvailable: typeof product.stock === 'number' && product.stock > 0,
          };
          return product;
        });
      }),
    );
  }

  // Response: array of objects (list of products), the first 'maxCount' products
  getFirstProducts(maxCount: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productURL).pipe(take(maxCount));
  }

  // Response: array of objects (list of orders)
  getProductsByIDs(IDs: string[]): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.productURL}?id=${IDs.join('&id=')}`);
  }

  // Response: product object or null
  getProductById(id: string | null): Observable<Product> {
    return this.httpClient.get<Product>(`${this.productURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    return this.httpClient.post<Product>(this.productURL, PRODUCT);
  }

  // Response: string, boolean, object + ID
  updateProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    return this.httpClient.put<Product>(`${this.productURL}/${product.id}`, PRODUCT);
  }

  // Response: string, boolean
  deleteProduct(id: string | null): Observable<Product> {
    return this.httpClient.delete<Product>(`${this.productURL}/${id}`);
  }
}
