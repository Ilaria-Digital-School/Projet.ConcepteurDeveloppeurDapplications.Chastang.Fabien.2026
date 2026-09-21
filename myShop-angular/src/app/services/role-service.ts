import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Role } from '../models/role';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.rolesURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all roles
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.url);
  }

  // Add a role
  addRole(role: Role): Observable<Role> {
    // Remove the _id before saving the Role
    const ROLE = role.removeBeforeSave();
    return this.httpClient.post<Role>(this.url, ROLE, this.httpHeaders);
  }

  // Update a role
  updateRole(role: Role): Observable<Role> {
    // Remove the _id before saving the Role
    const ROLE = role.removeBeforeSave();
    return this.httpClient.put<Role>(`${this.url}/${role._id}`, ROLE, this.httpHeaders);
  }

  // Delete a role
  deleteRole(id: string | null): Observable<Role> {
    return this.httpClient.delete<Role>(`${this.url}/${id}`, this.httpHeaders);
  }
}
