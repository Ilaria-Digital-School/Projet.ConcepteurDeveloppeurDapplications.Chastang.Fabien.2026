export class Roles {
  static other = { value: 0, label: 'Utilisateur' };
  static list = [{ value: 1, label: 'Admin.' }, { value: 2, label: 'Super Admin.' }, this.other];

  // Get the ID from the name and the name from the ID
  static getId(roleName: string) {
    const ROLE = this.list.find((item) => item.label.toLowerCase() == roleName);
    return ROLE ? ROLE.value : this.other.value;
  }
  static getName(roleId: number) {
    const ROLE = this.list.find((item) => item.value == roleId);
    return ROLE ? ROLE.label : this.other.label;
  }
}
