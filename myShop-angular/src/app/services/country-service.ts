import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  // Destination / Address
  countryURL: string = 'http://localhost:3000/countries';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of countries)
  getAllCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countryURL);
  }

  // Response: country object or null
  getCountryById(id: string | null): Observable<Country> {
    return this.httpClient.get<Country>(`${this.countryURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addCountry(country: Country): Observable<Country> {
    return this.httpClient.post<Country>(this.countryURL, country);
  }

  // Response: string, boolean, object + ID
  updateCountry(country: Country): Observable<Country> {
    return this.httpClient.put<Country>(`${this.countryURL}/${country.id}`, country);
  }

  // Response: string, boolean
  deleteCountry(id: string | null): Observable<Country> {
    return this.httpClient.delete<Country>(`${this.countryURL}/${id}`);
  }
}
