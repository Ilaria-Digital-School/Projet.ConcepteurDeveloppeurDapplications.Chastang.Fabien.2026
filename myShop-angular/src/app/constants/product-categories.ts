import { EnumCategories } from '../enums/product-categories';
import { ItemCst } from '../types/items';

// Product category class
export class ProductCategories {
  static other: ItemCst = { value: EnumCategories.other, id: 'other', label: '– Indéfini –' };
  static list: ItemCst[] = [
    { value: EnumCategories.women, id: 'women', label: 'Femme' },
    { value: EnumCategories.men, id: 'men', label: 'Homme' },
    { value: EnumCategories.children, id: 'children', label: 'Enfant' },
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
