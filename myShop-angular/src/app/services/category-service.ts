import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.categories}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of categories)
  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.resourceURL);
  }

  // Response: category object or null
  getCategoryById(id: string | null): Observable<Category> {
    return this.httpClient.get<Category>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.resourceURL, category);
  }

  // Response: string, boolean, object + ID
  updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${this.resourceURL}/${category.id}`, category);
  }

  // Response: string, boolean
  deleteCategory(id: string | null): Observable<Category> {
    return this.httpClient.delete<Category>(`${this.resourceURL}/${id}`);
  }
}
