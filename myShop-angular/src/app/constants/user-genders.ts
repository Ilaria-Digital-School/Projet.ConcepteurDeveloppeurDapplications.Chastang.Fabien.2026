import { EnumGenders } from '../enums/user-genders';
import { ItemCst } from "../types/items";

// User's gender class
export class UserGenders {
  static other: ItemCst = { value: EnumGenders.other, id: 'other', label: '– Indéfini –' };
  static list: ItemCst[] = [
    { value: EnumGenders.female, id: 'female', label: 'Femme' },
    { value: EnumGenders.male, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: ItemCst) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number, other: string | undefined = undefined): string {
    const ITEM = this.list.find((item: ItemCst) => item.value === value);
    return !ITEM || !ITEM.value ? (other ? other : this.other.label) : ITEM.label;
  }
}
