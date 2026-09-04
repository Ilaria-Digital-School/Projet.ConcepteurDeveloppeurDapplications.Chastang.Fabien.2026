import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { User, LoginData } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Resources URL
  usersURL: string = `${Resources.baseURL}/${Resources.users}`;

  // Retrieve all users
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.usersURL);
  }

  // Retrieve a user by his ID
  getUserById(id: string | null): Observable<User> {
    return this.httpClient.get<User>(`${this.usersURL}/${id}`);
  }

  // Add a user
  addUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.dateIns = Date.now();
    return this.httpClient.post<User>(this.usersURL, USER);
  }

  // Update a user
  updateUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.dateMod = Date.now();
    return this.httpClient.put<User>(`${this.usersURL}/${user.id}`, USER);
  }

  // Show a user
  showUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.visible = true;
    return this.httpClient.put<User>(`${this.usersURL}/${user.id}`, USER);
  }

  // Hide a user
  hideUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.visible = false;
    return this.httpClient.put<User>(`${this.usersURL}/${user.id}`, USER);
  }

  // Delete a user
  deleteUser(id: string | null): Observable<User> {
    return this.httpClient.delete<User>(`${this.usersURL}/${id}`);
  }

  // User login
  login(data: LoginData): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.usersURL}?email=${data.email}&pswd=${data.pswd}`);

    // // IMPORTANT: method to use with a real backend
    // return this.httpClient.post<User[]>(`${this.usersURL}/login`, data);

    // // Retrieving data from local storage
    // const USERS = JSON.parse(localStorage.getItem('users') || '[]');
    // return USERS.find((user: any) => user.email == data.email && user.pswd == data.pswd);
  }
}
