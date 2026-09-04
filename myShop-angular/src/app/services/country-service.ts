import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Resources URL
  countriesURL: string = `${Resources.baseURL}/${Resources.countries}`;

  // Retrieve all genders
  getAllCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesURL);
  }

  // Add a country
  addCountry(country: Country): Observable<Country> {
    return this.httpClient.post<Country>(this.countriesURL, country);
  }

  // Update a country
  updateCountry(country: Country): Observable<Country> {
    return this.httpClient.put<Country>(`${this.countriesURL}/${country.id}`, country);
  }

  // Delete a country
  deleteCountry(id: string | null): Observable<Country> {
    return this.httpClient.delete<Country>(`${this.countriesURL}/${id}`);
  }
}
