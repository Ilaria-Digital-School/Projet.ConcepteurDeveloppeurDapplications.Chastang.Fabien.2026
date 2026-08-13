// Enumeration of user roles
export class UserRole {
  static user: number = 0;
  static admin: number = 1;
  static superAdmin: number = 2;

  static list: number[] = [this.user, this.admin, this.superAdmin];
}
