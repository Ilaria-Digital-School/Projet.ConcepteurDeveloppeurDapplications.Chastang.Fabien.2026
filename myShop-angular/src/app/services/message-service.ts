import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve a message by its ID
  getMessageById(id: string | null): Observable<Message> {
    return this.httpClient.get<Message>(`${Resources.messagesURL}/${id}`);
  }

  // Retrieve a message by its user email
  getMessageByEmail(email: string | null): Observable<Message> {
    return this.httpClient.get<Message>(`${Resources.messagesURL}?email=${email}`);
  }

  // Add a message
  addMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.dateIns = Date.now();
    return this.httpClient.post<Message>(Resources.messagesURL, MESSAGE);
  }

  // Reply to a message
  replyMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.dateRep = Date.now();
    return this.httpClient.put<Message>(`${Resources.messagesURL}/${message.id}`, MESSAGE);
  }

  // Show a message
  showMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.visible = true;
    return this.httpClient.put<Message>(`${Resources.messagesURL}/${message.id}`, MESSAGE);
  }

  // Hide a message
  hideMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSaveMessage(); // Remove these properties before saving the message
    MESSAGE.visible = false;
    return this.httpClient.put<Message>(`${Resources.messagesURL}/${message.id}`, MESSAGE);
  }

  // Delete a message
  deleteMessage(id: string | null): Observable<Message> {
    return this.httpClient.delete<Message>(`${Resources.messagesURL}/${id}`);
  }
}
