import { inject } from '@angular/core';
import { RoleService } from '../services/role-service';

// Role class
export class Role {
  id: string = '';
  value: number = 0;
  field: string = '';
  name: string = '';

  constructor(
    id: string | null = null,
    value: number | null = null,
    field: string | null = null,
    name: string | null = null,
  ) {
    if (typeof id === 'string') this.id = id;
    if (typeof value === 'number') this.value = value;
    if (typeof field === 'string') this.field = field;
    if (typeof name === 'string') this.name = name;
  }
}

// Class to handle the role list
export class RoleList {
  private roleService = inject(RoleService);
  private roles: Role[] = [];

  constructor() {
    // Retrieve all roles
    this.roleService.getAllRoles().subscribe({
      next: (res: Role[]) => {
        this.roles = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Returns the role list
  getAll(): Role[] {
    return this.roles;
  }

  // Returns a role by its value
  getByValue(value: number): Role | undefined {
    return this.roles.find((role: Role) => role.value === value);
  }
}
