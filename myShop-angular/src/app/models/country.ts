import { inject } from '@angular/core';
import { CountryService } from '../services/country-service';

// Country class
export class Country {
  id: string = '';
  value: number = 0;
  name: string = '';

  constructor(
    id: string | null = null,
    value: number | null = null,
    name: string | null = null,
  ) {
    if (typeof id === 'string') this.id = id;
    if (typeof value === 'number') this.value = value;
    if (typeof name === 'string') this.name = name;
  }
}

// Class to handle the country list
export class CountryList {
  private countryService = inject(CountryService);
  private countries: Country[] = [];

  constructor() {
    // Retrieve all countries
    this.countryService.getAllCountries().subscribe({
      next: (res: Country[]) => {
        this.countries = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Returns the country list
  getAll(): Country[] {
    return this.countries;
  }

  // Returns a country by its value
  getByValue(value: number): Country | undefined {
    return this.countries.find((country: Country) => country.value === value);
  }
}
