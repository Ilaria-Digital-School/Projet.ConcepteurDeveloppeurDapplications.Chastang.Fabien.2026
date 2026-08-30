import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Destination / Address
  roleURL: string = 'http://localhost:3000/roles';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of roles)
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.roleURL);
  }

  // Response: role object or null
  getRoleById(id: string | null): Observable<Role> {
    return this.httpClient.get<Role>(`${this.roleURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(this.roleURL, role);
  }

  // Response: string, boolean, object + ID
  updateRole(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.roleURL}/${role.id}`, role);
  }

  // Response: string, boolean
  deleteRole(id: string | null): Observable<Role> {
    return this.httpClient.delete<Role>(`${this.roleURL}/${id}`);
  }
}
