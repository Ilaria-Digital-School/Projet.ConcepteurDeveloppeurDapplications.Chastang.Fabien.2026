import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { User, LoginData, Token } from '../models/user';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve all users
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(Resources.usersURL, Common.getHttpHeaders());
  }

  // Retrieve a user by his ID
  getUserById(id: string | undefined | null): Observable<User> {
    return this.httpClient.get<User>(`${Resources.usersURL}/${id}`, Common.getHttpHeaders());
  }

  // NO TOKEN - Add a user
  addUser(user: User): Observable<User> {
    const USER = user.removeBeforeSave(); // Remove these properties before saving the User
    return this.httpClient.post<User>(Resources.usersURL, USER);
  }

  // Update a user
  updateUser(user: User): Observable<User> {
    const USER = user.removeBeforeSave(); // Remove these properties before saving the User
    return this.httpClient.put<User>(
      `${Resources.usersURL}/${user._id}`,
      USER,
      Common.getHttpHeaders(),
    );
  }

  // Show a user
  showUser(user: User): Observable<User> {
    const USER = user.removeBeforeSave(); // Remove these properties before saving the User
    USER.visible = true;
    return this.httpClient.patch<User>(
      `${Resources.usersURL}/${user._id}/visible`,
      USER,
      Common.getHttpHeaders(),
    );
  }

  // Hide a user
  hideUser(user: User): Observable<User> {
    const USER = user.removeBeforeSave(); // Remove these properties before saving the User
    USER.visible = false;
    return this.httpClient.patch<User>(
      `${Resources.usersURL}/${user._id}/visible`,
      USER,
      Common.getHttpHeaders(),
    );
  }

  // Delete a user
  deleteUser(id: string | undefined | null): Observable<User> {
    return this.httpClient.delete<User>(`${Resources.usersURL}/${id}`, Common.getHttpHeaders());
  }

  // NO TOKEN - User login
  login(data: LoginData): Observable<Token> {
    return this.httpClient.post<Token>(`${Resources.usersURL}/login`, data);
  }
}
