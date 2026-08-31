import { inject } from '@angular/core';
import { InterestService } from '../services/interest-service';

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

// Object containing the values ​​of interest
export type InterestValues = { clothes: number; accessories: number };

// Message displayed when an error occurs during the initialization
// of the object containing the values ​​of interest
const ERR_MSG_INTEREST_VALUES =
  "Les données liées aux centres d'intérêt de l'utilisateur et aux types de produit sont invalides !";

// Class to handle the interest list
export class InterestList {
  private interestService = inject(InterestService);
  private interests: Interest[] = [];
  private _objectValues!: InterestValues;

  constructor() {
    // Retrieve all interests
    this.interestService.getAllInterests().subscribe({
      next: (res: Interest[]) => {
        this.interests = res;

        // Initialize the object containing the values ​​of interest
        this.initValues();
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Initialize the object containing the values ​​of interest
  private initValues() {
    const CLOTHES = this.interests.find((i: Interest) => i.field === 'clothes');
    const ACCESSORIES = this.interests.find((i: Interest) => i.field === 'accessories');
    if (CLOTHES !== undefined && ACCESSORIES !== undefined) {
      this._objectValues = {
        clothes: CLOTHES.value,
        accessories: ACCESSORIES.value,
      };
    } else {
      // If an error occurs, display a message
      alert(ERR_MSG_INTEREST_VALUES);
    }
  }

  // Returns the interest list
  get items(): Interest[] {
    return this.interests;
  }

  // Returns the object containing the values ​​of interest
  get objectValues(): InterestValues {
    return this._objectValues;
  }

  // Returns a interest by its value
  getByValue(value: number): Interest | undefined {
    return this.interests.find((interest: Interest) => interest.value === value);
  }
}
