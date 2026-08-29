import { EnumTypes } from '../enums/product-types';
import { ItemCst } from "../types/items";

// Product type class
export class ProductTypes {
  static other: ItemCst = { value: EnumTypes.other, id: 'other', label: '– Indéfini –' };
  static list: ItemCst[] = [
    { value: EnumTypes.clothes, id: 'clothes', label: 'Vêtement' },
    { value: EnumTypes.accessories, id: 'accessories', label: 'Accessoire' },
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
