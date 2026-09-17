import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Role } from '../models/role';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // NO TOKEN - Retrieve all roles
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(Resources.rolesURL);
  }

  // Add a role
  addRole(role: Role): Observable<Role> {
    const ROLE = role.removeBeforeSave(); // Remove the _id before saving the Role
    return this.httpClient.post<Role>(Resources.rolesURL, ROLE, Common.getHttpHeaders());
  }

  // Update a role
  updateRole(role: Role): Observable<Role> {
    const ROLE = role.removeBeforeSave(); // Remove the _id before saving the Role
    return this.httpClient.put<Role>(
      `${Resources.rolesURL}/${role._id}`,
      ROLE,
      Common.getHttpHeaders(),
    );
  }

  // Delete a role
  deleteRole(id: string | null): Observable<Role> {
    return this.httpClient.delete<Role>(`${Resources.rolesURL}/${id}`, Common.getHttpHeaders());
  }
}
