import { EnumInterests } from '../enums/user-interests';
import { ItemConst } from "./global/types";

// User's interests class
export class Interests {
  static other: ItemConst = { value: EnumInterests.none, id: 'other', label: '– Autre –' };
  static list: ItemConst[] = [
    { value: EnumInterests.clothes, id: 'clothes', label: 'Vêtements' },
    { value: EnumInterests.accessories, id: 'accessories', label: 'Accessoires' },
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
