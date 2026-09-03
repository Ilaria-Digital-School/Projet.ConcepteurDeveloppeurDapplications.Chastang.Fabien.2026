import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.roles}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of roles)
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.resourceURL);
  }

  // Response: role object or null
  getRoleById(id: string | null): Observable<Role> {
    return this.httpClient.get<Role>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(this.resourceURL, role);
  }

  // Response: string, boolean, object + ID
  updateRole(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.resourceURL}/${role.id}`, role);
  }

  // Response: string, boolean
  deleteRole(id: string | null): Observable<Role> {
    return this.httpClient.delete<Role>(`${this.resourceURL}/${id}`);
  }
}
