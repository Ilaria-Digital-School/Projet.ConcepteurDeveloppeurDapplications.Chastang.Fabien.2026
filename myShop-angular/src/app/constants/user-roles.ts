import { EnumRoles } from "../enums/user-roles";
import { ItemShort } from "./global/types";

// User's role class
export class Roles {
  static other: ItemShort = { value: EnumRoles.user, label: 'Utilisateur' };
  static list: ItemShort[] = [
    { value: EnumRoles.admin, label: 'Administrateur' },
    { value: EnumRoles.superAdmin, label: 'Super Admin.' },
    this.other,
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: ItemShort) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : this.other.value;
  }
  static getLabel(value: number): string {
    const ITEM = this.list.find((item: ItemShort) => item.value === value);
    return ITEM ? ITEM.label : this.other.label;
  }
}
