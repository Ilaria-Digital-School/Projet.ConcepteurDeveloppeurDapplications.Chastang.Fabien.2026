import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.countries}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of countries)
  getAllCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.resourceURL);
  }

  // Response: country object or null
  getCountryById(id: string | null): Observable<Country> {
    return this.httpClient.get<Country>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addCountry(country: Country): Observable<Country> {
    return this.httpClient.post<Country>(this.resourceURL, country);
  }

  // Response: string, boolean, object + ID
  updateCountry(country: Country): Observable<Country> {
    return this.httpClient.put<Country>(`${this.resourceURL}/${country.id}`, country);
  }

  // Response: string, boolean
  deleteCountry(id: string | null): Observable<Country> {
    return this.httpClient.delete<Country>(`${this.resourceURL}/${id}`);
  }
}
