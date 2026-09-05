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

  // Retrieve all users
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(Resources.usersURL);
  }

  // Retrieve a user by his ID
  getUserById(id: string | null): Observable<User> {
    return this.httpClient.get<User>(`${Resources.usersURL}/${id}`);
  }

  // Add a user
  addUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.dateIns = Date.now();
    return this.httpClient.post<User>(Resources.usersURL, USER);
  }

  // Update a user
  updateUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.dateMod = Date.now();
    return this.httpClient.put<User>(`${Resources.usersURL}/${user.id}`, USER);
  }

  // Show a user
  showUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.visible = true;
    USER.dateHidden = null;
    return this.httpClient.put<User>(`${Resources.usersURL}/${user.id}`, USER);
  }

  // Hide a user
  hideUser(user: User): Observable<User> {
    const USER = user.removeBeforeSaveUser(); // Remove these properties before saving the user
    USER.visible = false;
    USER.dateHidden = Date.now();
    return this.httpClient.put<User>(`${Resources.usersURL}/${user.id}`, USER);
  }

  // Delete a user
  deleteUser(id: string | null): Observable<User> {
    return this.httpClient.delete<User>(`${Resources.usersURL}/${id}`);
  }

  // User login
  login(data: LoginData): Observable<User[]> {
    return this.httpClient.get<User[]>(`${Resources.usersURL}?email=${data.email}&pswd=${data.pswd}`);

    // // IMPORTANT: method to use with a real backend
    // return this.httpClient.post<User[]>(`${Resources.usersURL}/login`, data);

    // // Retrieving data from local storage
    // const USERS = JSON.parse(localStorage.getItem('users') || '[]');
    // return USERS.find((user: any) => user.email == data.email && user.pswd == data.pswd);
  }
}
