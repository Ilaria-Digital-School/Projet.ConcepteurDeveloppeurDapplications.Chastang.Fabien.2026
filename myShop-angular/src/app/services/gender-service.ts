import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Gender } from '../models/gender';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.gendersURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all genders
  getAllGenders(): Observable<Gender[]> {
    return this.httpClient.get<Gender[]>(this.url);
  }

  // Add a gender
  addGender(gender: Gender): Observable<Gender> {
    const GENDER = gender.removeBeforeSave(); // Remove the _id before saving the Gender
    return this.httpClient.post<Gender>(this.url, GENDER, this.httpHeaders);
  }

  // Update a gender
  updateGender(gender: Gender): Observable<Gender> {
    const GENDER = gender.removeBeforeSave(); // Remove the _id before saving the Gender
    return this.httpClient.put<Gender>(`${this.url}/${gender._id}`, GENDER, this.httpHeaders);
  }

  // Delete a gender
  deleteGender(id: string | null): Observable<Gender> {
    return this.httpClient.delete<Gender>(`${this.url}/${id}`, this.httpHeaders);
  }
}
