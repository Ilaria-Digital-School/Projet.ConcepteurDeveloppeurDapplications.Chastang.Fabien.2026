import { EnumRoles } from "../enums/user-roles";

// User's role class
export class Roles {
  static other = { value: EnumRoles.user, label: 'Utilisateur' };
  static list = [
    { value: EnumRoles.admin, label: 'Administrateur' },
    { value: EnumRoles.superAdmin, label: 'Super Admin.' },
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
