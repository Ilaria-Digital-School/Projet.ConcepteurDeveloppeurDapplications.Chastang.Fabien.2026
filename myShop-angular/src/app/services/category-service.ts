import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Destination / Address
  categoryURL: string = 'http://localhost:3000/categories';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of categories)
  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.categoryURL);
  }

  // Response: category object or null
  getCategoryById(id: string | null): Observable<Category> {
    return this.httpClient.get<Category>(`${this.categoryURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.categoryURL, category);
  }

  // Response: string, boolean, object + ID
  updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${this.categoryURL}/${category.id}`, category);
  }

  // Response: string, boolean
  deleteCategory(id: string | null): Observable<Category> {
    return this.httpClient.delete<Category>(`${this.categoryURL}/${id}`);
  }
}
