import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Destination / Address
  messageURL: string = 'http://localhost:3000/messages';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: product object or null
  getMessageMessageById(id: string | null): Observable<Message> {
    return this.httpClient.get<Message>(`${this.messageURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addMessageMessage(message: Message): Observable<Message> {
    message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    return this.httpClient.post<Message>(this.messageURL, message);
  }

  // Response: string, boolean
  deleteMessageMessage(id: string | null): Observable<Message> {
    return this.httpClient.delete<Message>(`${this.messageURL}/${id}`);
  }
}
