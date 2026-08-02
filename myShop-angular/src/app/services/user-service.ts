import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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

  // Response: string, boolean, object + ID
  addUser(user: any) {
    return this.httpClient.post(this.userURL, user);
  }

  // Response: user object or null
  getUserById(id: any) {
    return this.httpClient.get(`${this.userURL}/${id}`);
  }

  // Response: string, boolean
  deleteUser(id: any) {
    return this.httpClient.delete(`${this.userURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  updateUser(user: any) {
    return this.httpClient.put(this.userURL, user);
  }
}
