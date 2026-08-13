import { UserRole } from '../enums/user-role';

// User's role class
export class Roles {
  static other = { value: UserRole.user, label: 'Utilisateur' };
  static list = [
    { value: UserRole.admin, label: 'Admin.' },
    { value: UserRole.superAdmin, label: 'Super Admin.' },
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
