import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { User, LoginData, Token } from '../models/user';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.usersURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // Retrieve all users
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.url, this.httpHeaders);
  }

  // Retrieve a user by his ID
  getUserById(id: string | undefined | null): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`, this.httpHeaders);
  }

  // NO TOKEN - Add a user
  addUser(user: User): Observable<User> {
    // Remove these properties before saving the User
    const USER = user.removeBeforeSave();
    return this.httpClient.post<User>(this.url, USER);
  }

  // Update a user
  updateUser(user: User): Observable<User> {
    // Remove these properties before saving the User
    const USER = user.removeBeforeSave();
    return this.httpClient.put<User>(`${this.url}/${user._id}`, USER, this.httpHeaders);
  }

  // Show a user
  showUser(user: User): Observable<User> {
    // Remove these properties before saving the User
    const USER = user.removeBeforeSave();
    // Show the item
    USER.visible = true;
    const URL = `${this.url}/${user._id}/visible`;
    return this.httpClient.patch<User>(URL, USER, this.httpHeaders);
  }

  // Hide a user
  hideUser(user: User): Observable<User> {
    // Remove these properties before saving the User
    const USER = user.removeBeforeSave();
    // Hide the item
    USER.visible = false;
    const URL = `${this.url}/${user._id}/visible`;
    return this.httpClient.patch<User>(URL, USER, this.httpHeaders);
  }

  // Delete a user
  deleteUser(id: string | undefined | null): Observable<User> {
    return this.httpClient.delete<User>(`${this.url}/${id}`, this.httpHeaders);
  }

  // NO TOKEN - User login
  login(data: LoginData): Observable<Token> {
    return this.httpClient.post<Token>(`${this.url}/login`, data);
  }
}
