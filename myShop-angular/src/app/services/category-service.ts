import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Category } from '../models/category';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.categoriesURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all categories
  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.url);
  }

  // Add a category
  addCategory(category: Category): Observable<Category> {
    // Remove the _id before saving the Category
    const CATEGORY = category.removeBeforeSave();
    return this.httpClient.post<Category>(this.url, CATEGORY, this.httpHeaders);
  }

  // Update a category
  updateCategory(category: Category): Observable<Category> {
    // Remove the _id before saving the Category
    const CATEGORY = category.removeBeforeSave();
    return this.httpClient.put<Category>(`${this.url}/${category._id}`, CATEGORY, this.httpHeaders);
  }

  // Delete a category
  deleteCategory(id: string | null): Observable<Category> {
    return this.httpClient.delete<Category>(`${this.url}/${id}`, this.httpHeaders);
  }
}
