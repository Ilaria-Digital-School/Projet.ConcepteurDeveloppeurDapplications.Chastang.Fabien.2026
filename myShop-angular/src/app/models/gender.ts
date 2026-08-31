import { inject } from '@angular/core';
import { GenderService } from '../services/gender-service';

// Gender class
export class Gender {
  id: string = '';
  value: number = 0;
  field: string = '';
  name: string = '';

  constructor(
    id: string | null = null,
    value: number | null = null,
    field: string | null = null,
    name: string | null = null,
  ) {
    if (typeof id === 'string') this.id = id;
    if (typeof value === 'number') this.value = value;
    if (typeof field === 'string') this.field = field;
    if (typeof name === 'string') this.name = name;
  }
}

// Class to handle the gender list
export class GenderList {
  private genderService = inject(GenderService);
  private genders: Gender[] = [];

  constructor() {
    // Retrieve all genders
    this.genderService.getAllGenders().subscribe({
      next: (res: Gender[]) => {
        this.genders = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Returns the gender list
  get items(): Gender[] {
    return this.genders;
  }

  // Returns a gender by its value
  getByValue(value: number): Gender | undefined {
    return this.genders.find((gender: Gender) => gender.value === value);
  }
}
