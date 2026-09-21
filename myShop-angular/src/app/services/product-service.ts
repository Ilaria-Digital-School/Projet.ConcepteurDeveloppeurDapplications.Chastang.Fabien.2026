import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Resources } from '../api.config';
import { Product } from '../models/product';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.productsURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all products
  getAllProducts(taxPercent: number = 20): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url).pipe(
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
    return this.httpClient.get<Product[]>(`${this.url}/${maxCount}/first`);
  }

  // NO TOKEN - Retrieve a list of products based on their IDs
  getProductsByIDs(IDs: string[]): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/${IDs.join(',')}/list`);
  }

  // NO TOKEN - Retrieve a product by its ID
  getProductById(id: string | undefined | null): Observable<Product> {
    return this.httpClient.get<Product>(`${this.url}/${id}`);
  }

  // Add a product
  addProduct(product: Product): Observable<Product> {
    // Remove these properties before saving the Product
    const PRODUCT = product.removeBeforeSave();
    return this.httpClient.post<Product>(this.url, PRODUCT, this.httpHeaders);

    // With cookie
    return this.httpClient.post<Product>(this.url, PRODUCT, {
      withCredentials: true,
    });
  }

  // Update a product
  updateProduct(product: Product): Observable<Product> {
    // Remove these properties before saving the Product
    const PRODUCT = product.removeBeforeSave();
    return this.httpClient.put<Product>(`${this.url}/${product._id}`, PRODUCT, this.httpHeaders);
  }

  // Show a product
  showProduct(product: Product): Observable<Product> {
    // Remove these properties before saving the Product
    const PRODUCT = product.removeBeforeSave();
    // Show the item
    PRODUCT.visible = true;
    const URL = `${this.url}/${product._id}/visible`;
    return this.httpClient.patch<Product>(URL, PRODUCT, this.httpHeaders);
  }

  // Hide a product
  hideProduct(product: Product): Observable<Product> {
    // Remove these properties before saving the Product
    const PRODUCT = product.removeBeforeSave();
    // Hide the item
    PRODUCT.visible = false;
    const URL = `${this.url}/${product._id}/visible`;
    return this.httpClient.patch<Product>(URL, PRODUCT, this.httpHeaders);
  }

  // Delete a product
  deleteProduct(id: string | undefined | null): Observable<Product> {
    return this.httpClient.delete<Product>(`${this.url}/${id}`, this.httpHeaders);
  }
}
