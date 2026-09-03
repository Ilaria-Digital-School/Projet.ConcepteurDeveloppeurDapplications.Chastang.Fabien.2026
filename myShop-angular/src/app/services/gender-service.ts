import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.genders}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of genders)
  getAllGenders(): Observable<Gender[]> {
    return this.httpClient.get<Gender[]>(this.resourceURL);
  }

  // Response: gender object or null
  getGenderById(id: string | null): Observable<Gender> {
    return this.httpClient.get<Gender>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addGender(gender: Gender): Observable<Gender> {
    return this.httpClient.post<Gender>(this.resourceURL, gender);
  }

  // Response: string, boolean, object + ID
  updateGender(gender: Gender): Observable<Gender> {
    return this.httpClient.put<Gender>(`${this.resourceURL}/${gender.id}`, gender);
  }

  // Response: string, boolean
  deleteGender(id: string | null): Observable<Gender> {
    return this.httpClient.delete<Gender>(`${this.resourceURL}/${id}`);
  }
}
