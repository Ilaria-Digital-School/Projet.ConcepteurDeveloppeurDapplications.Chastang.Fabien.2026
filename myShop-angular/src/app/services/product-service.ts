import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { Resources } from '../api.config';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve all products
  getAllProducts(taxPercent: number = 20): Observable<Product[]> {
    return this.httpClient.get<Product[]>(Resources.productsURL).pipe(
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
            isAvailable: product.stock > 0,
          };
          return product;
        });
      }),
    );
  }

  // Retrieve the first 'maxCount' products
  getFirstProducts(maxCount: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(Resources.productsURL).pipe(take(maxCount));
  }

  // Retrieve a list of products based on their IDs
  getProductsByIDs(IDs: string[]): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${Resources.productsURL}?id=${IDs.join('&id=')}`);
  }

  // Retrieve a product by its ID
  getProductById(id: string | null): Observable<Product> {
    return this.httpClient.get<Product>(`${Resources.productsURL}/${id}`);
  }

  // Add a product
  addProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.dateIns = Date.now();
    return this.httpClient.post<Product>(Resources.productsURL, PRODUCT);
  }

  // Update a product
  updateProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.dateMod = Date.now();
    return this.httpClient.put<Product>(`${Resources.productsURL}/${product.id}`, PRODUCT);
  }

  // Show a product
  showProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.visible = true;
    PRODUCT.dateHidden = null;
    return this.httpClient.put<Product>(`${Resources.productsURL}/${product.id}`, PRODUCT);
  }

  // Hide a product
  hideProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.visible = false;
    PRODUCT.dateHidden = Date.now();
    return this.httpClient.put<Product>(`${Resources.productsURL}/${product.id}`, PRODUCT);
  }

  // Delete a product
  deleteProduct(id: string | null): Observable<Product> {
    return this.httpClient.delete<Product>(`${Resources.productsURL}/${id}`);
  }
}
