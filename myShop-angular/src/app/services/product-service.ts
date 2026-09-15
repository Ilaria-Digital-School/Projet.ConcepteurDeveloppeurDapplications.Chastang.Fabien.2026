import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Resources } from '../api.config';
import { Product } from '../models/product';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // NO TOKEN - Retrieve all products
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

  // NO TOKEN - Retrieve the first 'maxCount' products
  getFirstProducts(maxCount: number): Observable<Product[]> {
    // Without cookie
    return this.httpClient.get<Product[]>(`${Resources.productsURL}/${maxCount}/first`);
  }

  // NO TOKEN - Retrieve a list of products based on their IDs
  getProductsByIDs(IDs: string[]): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${Resources.productsURL}/${IDs.join(',')}/list`);
  }

  // NO TOKEN - Retrieve a product by its ID
  getProductById(id: string | null): Observable<Product> {
    return this.httpClient.get<Product>(`${Resources.productsURL}/${id}`);
  }

  // Add a product
  addProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    return this.httpClient.post<Product>(Resources.productsURL, PRODUCT, Common.getHttpHeaders());

    // With cookie
    return this.httpClient.post<Product>(Resources.productsURL, PRODUCT, {
      withCredentials: true,
    });
  }

  // Update a product
  updateProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    return this.httpClient.put<Product>(
      `${Resources.productsURL}/${product._id}`,
      PRODUCT,
      Common.getHttpHeaders(),
    );
  }

  // Show a product
  showProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.visible = true;
    return this.httpClient.patch<Product>(
      `${Resources.productsURL}/${product._id}/visible`,
      PRODUCT,
      Common.getHttpHeaders(),
    );
  }

  // Hide a product
  hideProduct(product: Product): Observable<Product> {
    const PRODUCT = product.removeBeforeSaveProduct(); // Remove these properties before saving the product
    PRODUCT.visible = false;
    return this.httpClient.patch<Product>(
      `${Resources.productsURL}/${product._id}/visible`,
      PRODUCT,
      Common.getHttpHeaders(),
    );
  }

  // Delete a product
  deleteProduct(id: string | null): Observable<Product> {
    return this.httpClient.delete<Product>(
      `${Resources.productsURL}/${id}`,
      Common.getHttpHeaders(),
    );
  }
}
