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

  // Retrieve all products - Response: array of objects (list of products)
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

  // Retrieve the first 'maxCount' products - Response: array of objects (list of products)
  getFirstProducts(maxCount: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productURL).pipe(take(maxCount));
  }

  // Retrieve a list of products based on their IDs - Response: array of objects (list of orders)
  getProductsByIDs(IDs: string[]): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.productURL}?id=${IDs.join('&id=')}`);
  }

  // Retrieve a product by its ID - Response: product object or null
  getProductById(id: string | null): Observable<Product> {
    return this.httpClient.get<Product>(`${this.productURL}/${id}`);
  }

  // Add a product - Response: string, boolean, object + ID
  addProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.dateIns = Date.now();
    return this.httpClient.post<Product>(this.productURL, PRODUCT);
  }

  // Update a product - Response: string, boolean, object + ID
  updateProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.dateMod = Date.now();
    return this.httpClient.put<Product>(`${this.productURL}/${product.id}`, PRODUCT);
  }

  // Show a product - Response: string, boolean, object + ID
  showProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.visible = true;
    return this.httpClient.put<Product>(`${this.productURL}/${product.id}`, PRODUCT);
  }

  // Hide a product - Response: string, boolean, object + ID
  hideProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.visible = false;
    return this.httpClient.put<Product>(`${this.productURL}/${product.id}`, PRODUCT);
  }

  // Delete a product - Response: string, boolean
  deleteProduct(id: string | null): Observable<Product> {
    return this.httpClient.delete<Product>(`${this.productURL}/${id}`);
  }
}
