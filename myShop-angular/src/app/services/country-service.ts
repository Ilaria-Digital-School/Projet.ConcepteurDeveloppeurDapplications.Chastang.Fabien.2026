import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Country } from '../models/country';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.countriesURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all genders
  getAllCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.url);
  }

  // Add a country
  addCountry(country: Country): Observable<Country> {
    // Remove the _id before saving the Country
    const COUNTRY = country.removeBeforeSave();
    return this.httpClient.post<Country>(this.url, COUNTRY, this.httpHeaders);
  }

  // Update a country
  updateCountry(country: Country): Observable<Country> {
    // Remove the _id before saving the Country
    const COUNTRY = country.removeBeforeSave();
    return this.httpClient.put<Country>(`${this.url}/${country._id}`, COUNTRY, this.httpHeaders);
  }

  // Delete a country
  deleteCountry(id: string | null): Observable<Country> {
    return this.httpClient.delete<Country>(`${this.url}/${id}`, this.httpHeaders);
  }
}
