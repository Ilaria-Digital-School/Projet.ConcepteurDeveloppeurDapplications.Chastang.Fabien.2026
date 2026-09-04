import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve all categories
  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(Resources.categoriesURL);
  }

  // Add a category
  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(Resources.categoriesURL, category);
  }

  // Update a category
  updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${Resources.categoriesURL}/${category.id}`, category);
  }

  // Delete a category
  deleteCategory(id: string | null): Observable<Category> {
    return this.httpClient.delete<Category>(`${Resources.categoriesURL}/${id}`);
  }
}
