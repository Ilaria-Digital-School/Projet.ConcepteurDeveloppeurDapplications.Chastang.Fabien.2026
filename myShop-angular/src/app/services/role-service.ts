import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Resources URL
  rolesURL: string = `${Resources.baseURL}/${Resources.roles}`;

  // Retrieve all roles
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.rolesURL);
  }

  // Add a role
  addRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(this.rolesURL, role);
  }

  // Update a role
  updateRole(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.rolesURL}/${role.id}`, role);
  }

  // Delete a role
  deleteRole(id: string | null): Observable<Role> {
    return this.httpClient.delete<Role>(`${this.rolesURL}/${id}`);
  }
}
