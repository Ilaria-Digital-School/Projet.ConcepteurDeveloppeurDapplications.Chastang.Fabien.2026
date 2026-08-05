import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../main';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Destination / Address
  userURL: string = 'http://localhost:3000/users';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of users)
  getAllUsers() {
    return this.httpClient.get<User[]>(this.userURL);
  }

  // Response: user object or null
  getUserById(id: string | null) {
    return this.httpClient.get<User>(`${this.userURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addUser(user: User) {
    return this.httpClient.post(this.userURL, user);
  }

  // Response: string, boolean
  deleteUser(id: string | null) {
    return this.httpClient.delete(`${this.userURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  updateUser(user: User) {
    return this.httpClient.put(`${this.userURL}/${user.id}`, user);
  }

  login(loginData: { email: string; pswd: string; permanent: boolean }): Observable<any> {
    return this.httpClient.get<User[]>(
      `${this.userURL}?email=${loginData.email}&pswd=${loginData.pswd}`,
    );

    // Retrieving data from local storage
    // this.users = JSON.parse(localStorage.getItem('users') || '[]');
    // this.user = this.users.find(
    //   (user: any) => user.email == FORM_VAL.email && user.pswd == FORM_VAL.pswd,
    // );
  }

  // IMPORTANT: method to use with a real backend
  // login(loginData: { email: string; pswd: string }): Observable<any> {
  //   return this.httpClient.post<User[]>(`${this.userURL}/login`, loginData);
  // }
}
