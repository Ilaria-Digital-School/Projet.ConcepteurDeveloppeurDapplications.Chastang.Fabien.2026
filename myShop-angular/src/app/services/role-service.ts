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
    return this.httpClient.post<Role>(Resources.rolesURL, role, Common.getHttpHeaders());
  }

  // Update a role
  updateRole(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(
      `${Resources.rolesURL}/${role._id}`,
      role,
      Common.getHttpHeaders(),
    );
  }

  // Delete a role
  deleteRole(id: string | null): Observable<Role> {
    return this.httpClient.delete<Role>(`${Resources.rolesURL}/${id}`, Common.getHttpHeaders());
  }
}
