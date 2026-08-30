import { inject } from '@angular/core';
import { StatusService } from '../services/status-service';

// Status class
export class Status {
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

// Class to handle the status list
export class StatusList {
  private statusService = inject(StatusService);
  private status: Status[] = [];

  constructor() {
    // Retrieve all status
    this.statusService.getAllStatus().subscribe({
      next: (res: Status[]) => {
        this.status = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Returns the status list
  getAll(): Status[] {
    return this.status;
  }

  // Returns a status by its value
  getByValue(value: number): Status | undefined {
    return this.status.find((status: Status) => status.value === value);
  }

  // Returns a status by its field
  getByField(field: string): Status | undefined {
    return this.status.find((status: Status) => status.field === field);
  }
}
