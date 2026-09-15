import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Gender } from '../models/gender';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // NO TOKEN - Retrieve all genders
  getAllGenders(): Observable<Gender[]> {
    return this.httpClient.get<Gender[]>(Resources.gendersURL);
  }

  // Add a gender
  addGender(gender: Gender): Observable<Gender> {
    return this.httpClient.post<Gender>(Resources.gendersURL, gender, Common.getHttpHeaders());
  }

  // Update a gender
  updateGender(gender: Gender): Observable<Gender> {
    return this.httpClient.put<Gender>(
      `${Resources.gendersURL}/${gender._id}`,
      gender,
      Common.getHttpHeaders(),
    );
  }

  // Delete a gender
  deleteGender(id: string | null): Observable<Gender> {
    return this.httpClient.delete<Gender>(`${Resources.gendersURL}/${id}`, Common.getHttpHeaders());
  }
}
