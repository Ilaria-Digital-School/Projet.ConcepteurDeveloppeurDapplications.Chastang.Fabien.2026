import { EnumGenders } from '../enums/user-genders';

// User's gender class
export class Genders {
  static other = { value: EnumGenders.other, id: 'other', label: '– Indéfini –' };
  static list = [
    { value: EnumGenders.female, id: 'female', label: 'Femme' },
    { value: EnumGenders.male, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: any) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number, other: string | undefined = undefined): string {
    const ITEM = this.list.find((item: any) => item.value === value);
    return !ITEM || !ITEM.value ? (other ? other : this.other.label) : ITEM.label;
  }
}
