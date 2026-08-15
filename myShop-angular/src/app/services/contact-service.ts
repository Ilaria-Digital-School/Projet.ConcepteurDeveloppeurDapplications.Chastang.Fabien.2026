import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactMessge } from '../models/contact-message';

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
    return this.httpClient.get<ContactMessge>(`${this.contactURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addContactMessage(product: ContactMessge) {
    return this.httpClient.post(this.contactURL, product);
  }

  // Response: string, boolean
  deleteContactMessage(id: string | null) {
    return this.httpClient.delete(`${this.contactURL}/${id}`);
  }
}
