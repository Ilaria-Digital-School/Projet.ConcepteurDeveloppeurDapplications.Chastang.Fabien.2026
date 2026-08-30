import { inject } from "@angular/core";
import { InterestService } from "../services/interest-service";

// Interest class
export class Interest {
  id: string = '';
  value: number = 0;
  field: string = '';
  name: string = '';
  type: string = '';

  constructor(
    id: string | null = null,
    value: number | null = null,
    field: string | null = null,
    name: string | null = null,
    type: string | null = null,
  ) {
    if (typeof id === 'string') this.id = id;
    if (typeof value === 'number') this.value = value;
    if (typeof field === 'string') this.field = field;
    if (typeof name === 'string') this.name = name;
    if (typeof type === 'string') this.type = type;
  }
}

// Class to handle the interest list
export class InterestList {
  private interestService = inject(InterestService);
  private interests: Interest[] = [];
  private values!: { clothes: number; accessories: number };

  constructor() {
    // Retrieve all interests
    this.interestService.getAllInterests().subscribe({
      next: (res: Interest[]) => {
        this.interests = res;

        // Initialize the object containing the values ​​of interest
        const CLOTHES = this.interests.find((i: Interest) => i.field === 'clothes');
        const ACCESSORIES = this.interests.find((i: Interest) => i.field === 'accessories');
        if (CLOTHES !== undefined && ACCESSORIES !== undefined) {
          this.values = {
            clothes: CLOTHES.value,
            accessories: ACCESSORIES.value,
          };
        } else {
          // If an error occurs, exit initialization
          alert('Les données permettant de remplir le formulaire sont invalides !');
        }
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Returns the interest list
  getAll(): Interest[] {
    return this.interests;
  }

  // Returns the object containing the values ​​of interest
  getValues(): { clothes: number; accessories: number } {
    return this.values;
  }

  // Returns a interest by its value
  getByValue(value: number): Interest | undefined {
    return this.interests.find((interest: Interest) => interest.value === value);
  }

  // Returns a interest by its field
  getByField(field: string): Interest | undefined {
    return this.interests.find((interest: Interest) => interest.field === field);
  }
}
