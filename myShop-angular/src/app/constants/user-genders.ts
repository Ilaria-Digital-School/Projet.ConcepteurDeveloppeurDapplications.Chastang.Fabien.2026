import { EnumGenders } from '../enums/user-genders';
import { ItemConst } from "./global/types";

// User's gender class
export class Genders {
  static other: ItemConst = { value: EnumGenders.other, id: 'other', label: '– Indéfini –' };
  static list: ItemConst[] = [
    { value: EnumGenders.female, id: 'female', label: 'Femme' },
    { value: EnumGenders.male, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: ItemConst) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number, other: string | undefined = undefined): string {
    const ITEM = this.list.find((item: ItemConst) => item.value === value);
    return !ITEM || !ITEM.value ? (other ? other : this.other.label) : ITEM.label;
  }
}
