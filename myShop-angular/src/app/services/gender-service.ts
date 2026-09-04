import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Resources URL
  gendersURL: string = `${Resources.baseURL}/${Resources.genders}`;

  // Retrieve all genders
  getAllGenders(): Observable<Gender[]> {
    return this.httpClient.get<Gender[]>(this.gendersURL);
  }

  // Add a gender
  addGender(gender: Gender): Observable<Gender> {
    return this.httpClient.post<Gender>(this.gendersURL, gender);
  }

  // Update a gender
  updateGender(gender: Gender): Observable<Gender> {
    return this.httpClient.put<Gender>(`${this.gendersURL}/${gender.id}`, gender);
  }

  // Delete a gender
  deleteGender(id: string | null): Observable<Gender> {
    return this.httpClient.delete<Gender>(`${this.gendersURL}/${id}`);
  }
}
