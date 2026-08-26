import { EnumCategories } from '../enums/product-categories';
import { ItemConst } from './global/types';

// User's category class
export class Categories {
  static other: ItemConst = { value: EnumCategories.other, id: 'other', label: '– Indéfini –' };
  static list: ItemConst[] = [
    { value: EnumCategories.women, id: 'women', label: 'Femme' },
    { value: EnumCategories.men, id: 'men', label: 'Homme' },
    { value: EnumCategories.children, id: 'children', label: 'Enfant' },
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
