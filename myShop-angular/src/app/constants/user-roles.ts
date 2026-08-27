import { EnumRoles } from "../enums/user-roles";
import { ItemCstShort } from "./global/types";

// User's role class
export class UserRoles {
  static other: ItemCstShort = { value: EnumRoles.user, label: 'Utilisateur' };
  static list: ItemCstShort[] = [
    { value: EnumRoles.admin, label: 'Administrateur' },
    { value: EnumRoles.superAdmin, label: 'Super Admin.' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: ItemCstShort) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number): string {
    const ITEM = this.list.find((item: ItemCstShort) => item.value === value);
    return ITEM ? ITEM.label : this.other.label;
  }
}
