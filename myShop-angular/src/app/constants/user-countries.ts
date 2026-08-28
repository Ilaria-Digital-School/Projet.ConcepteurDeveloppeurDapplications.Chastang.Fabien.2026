import { ItemCstShort } from '../types/items';

// User's country class
export class UserCountries {
  static other: ItemCstShort = { value: 0, label: '– Autre –' };
  static list: ItemCstShort[] = [
    { value: 1, label: 'Allemagne' },
    { value: 2, label: 'Autriche' },
    { value: 3, label: 'Belgique' },
    { value: 4, label: 'Brésil' },
    { value: 5, label: 'Canada' },
    { value: 6, label: 'Chine' },
    { value: 7, label: 'Espagne' },
    { value: 8, label: 'États-Unis' },
    { value: 9, label: 'France' },
    { value: 10, label: 'Grèce' },
    { value: 11, label: 'Inde' },
    { value: 12, label: 'Italie' },
    { value: 13, label: 'Japon' },
    { value: 14, label: 'Luxembourg' },
    { value: 15, label: 'Mauritanie' },
    { value: 16, label: 'Mexique' },
    { value: 17, label: 'Portugal' },
    { value: 18, label: 'Royaume-Uni' },
    { value: 19, label: 'Sénégal' },
    { value: 20, label: 'Suisse' },
    { value: 21, label: 'Taïwan' },
    { value: 22, label: 'Tunisie' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const ITEM = this.list.find((item: ItemCstShort) => item.label.toLowerCase() === label);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number, other: string | undefined = undefined): string {
    const ITEM = this.list.find((item: ItemCstShort) => item.value === value);
    return !ITEM || !ITEM.value ? (other ? other : this.other.label) : ITEM.label;
  }
}
