import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.messages}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Retrieve a message by its ID - Response: message object or null
  getMessageById(id: string | null): Observable<Message> {
    return this.httpClient.get<Message>(`${this.resourceURL}/${id}`);
  }

  // Retrieve a message by its user email - Response: message object or null
  getMessageByEmail(email: string | null): Observable<Message> {
    return this.httpClient.get<Message>(`${this.resourceURL}?email=${email}`);
  }

  // Add a message - Response: string, boolean, object + ID
  addMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.dateIns = Date.now();
    return this.httpClient.post<Message>(this.resourceURL, MESSAGE);
  }

  // Reply to a message - Response: string, boolean, object + ID
  replyMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.dateRep = Date.now();
    return this.httpClient.put<Message>(`${this.resourceURL}/${message.id}`, MESSAGE);
  }

  // Show a message - Response: string, boolean, object + ID
  showMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.visible = true;
    return this.httpClient.put<Message>(`${this.resourceURL}/${message.id}`, MESSAGE);
  }

  // Hide a message - Response: string, boolean, object + ID
  hideMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.visible = false;
    return this.httpClient.put<Message>(`${this.resourceURL}/${message.id}`, MESSAGE);
  }

  // Delete a message - Response: string, boolean
  deleteMessage(id: string | null): Observable<Message> {
    return this.httpClient.delete<Message>(`${this.resourceURL}/${id}`);
  }
}
