import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
    return this.httpClient.get(this.userURL);
  }

  // Response: user object or null
  getUserById(id: string | null) {
    return this.httpClient.get(`${this.userURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addUser(user: any) {
    return this.httpClient.post(this.userURL, user);
  }

  // Response: string, boolean
  deleteUser(id: string | null) {
    return this.httpClient.delete(`${this.userURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  updateUser(user: any) {
    return this.httpClient.put(this.userURL, user);
  }

  login(loginData: { email: string; pswd: string; permanent: boolean }): Observable<any> {
    return this.httpClient.get<any[]>(
      `${this.userURL}?email=${loginData.email}&pswd=${loginData.pswd}`,
    );

    // this.users = JSON.parse(localStorage.getItem('users') || '[]');
    // this.user = this.users.find(
    //   (user: any) => user.email == FORM_VAL.email && user.pswd == FORM_VAL.pswd,
    // );
  }

  // login(loginData: { email: string; pswd: string }): Observable<any> {
  //   return this.httpClient.post<any[]>(`${this.userURL}/login`, loginData);
  // }
}
