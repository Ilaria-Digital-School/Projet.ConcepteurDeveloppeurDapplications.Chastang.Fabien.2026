import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { User, LoginData } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.users}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Retrieve all users - Response: array of objects (list of users)
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.resourceURL);
  }

  // Retrieve a user by his ID - Response: user object or null
  getUserById(id: string | null): Observable<User> {
    return this.httpClient.get<User>(`${this.resourceURL}/${id}`);
  }

  // Add a user - Response: string, boolean, object + ID
  addUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.dateIns = Date.now();
    return this.httpClient.post<User>(this.resourceURL, USER);
  }

  // Update a user - Response: string, boolean, object + ID
  updateUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.dateMod = Date.now();
    return this.httpClient.put<User>(`${this.resourceURL}/${user.id}`, USER);
  }

  // Show a user - Response: string, boolean, object + ID
  showUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.visible = true;
    return this.httpClient.put<User>(`${this.resourceURL}/${user.id}`, USER);
  }

  // Hide a user - Response: string, boolean, object + ID
  hideUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.visible = false;
    return this.httpClient.put<User>(`${this.resourceURL}/${user.id}`, USER);
  }

  // Delete a user - Response: string, boolean
  deleteUser(id: string | null): Observable<User> {
    return this.httpClient.delete<User>(`${this.resourceURL}/${id}`);
  }

  // User login
  login(data: LoginData): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.resourceURL}?email=${data.email}&pswd=${data.pswd}`);

    // // IMPORTANT: method to use with a real backend
    // return this.httpClient.post<User[]>(`${this.resourceURL}/login`, data);

    // // Retrieving data from local storage
    // const USERS = JSON.parse(localStorage.getItem('users') || '[]');
    // return USERS.find((user: any) => user.email == data.email && user.pswd == data.pswd);
  }
}
