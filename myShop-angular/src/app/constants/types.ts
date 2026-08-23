import { EnumTypes } from '../enums/product-types';

// User's type class
export class Types {
  static other = { value: EnumTypes.other, id: 'other', label: '– Indéfini –' };
  static list = [
    { value: EnumTypes.clothes, id: 'clothes', label: 'Vêtement' },
    { value: EnumTypes.accessories, id: 'accessories', label: 'Accessoire' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: any) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number): string {
    const ITEM = this.list.find((item: any) => item.value === value);
    return ITEM ? ITEM.label : this.other.label;
  }
}
