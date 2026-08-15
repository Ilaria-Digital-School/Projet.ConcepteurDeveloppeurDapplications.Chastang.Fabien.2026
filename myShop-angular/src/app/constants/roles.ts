import { EnumRoles } from "../enums/user-roles";

// User's role class
export class Roles {
  static other = { value: EnumRoles.user, label: 'Utilisateur' };
  static list = [
    { value: EnumRoles.admin, label: 'Admin.' },
    { value: EnumRoles.superAdmin, label: 'Super Admin.' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  static getId(roleName: string) {
    const NAME = roleName.trim().toLowerCase();
    const ROLE = this.list.find((item: any) => item.label.toLowerCase() === NAME);
    return ROLE ? ROLE.value : this.other.value;
  }
  static getName(roleId: number) {
    const ROLE = this.list.find((item: any) => item.value === roleId);
    return ROLE ? ROLE.label : this.other.label;
  }
}
