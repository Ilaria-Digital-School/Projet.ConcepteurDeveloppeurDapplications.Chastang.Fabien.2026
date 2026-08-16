import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // Destination / Address
  contactURL: string = 'http://localhost:3000/contacts';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: product object or null
  getContactMessageById(id: string | null) {
    return this.httpClient.get<Contact>(`${this.contactURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addContactMessage(product: Contact) {
    return this.httpClient.post(this.contactURL, product);
  }

  // Response: string, boolean
  deleteContactMessage(id: string | null) {
    return this.httpClient.delete(`${this.contactURL}/${id}`);
  }
}
