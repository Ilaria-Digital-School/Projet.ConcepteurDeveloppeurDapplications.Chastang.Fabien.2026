import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Message } from '../models/message';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve a message by its user email
  getMessagesByEmail(email: string | null): Observable<Message> {
    return this.httpClient.get<Message>(
      `${Resources.messagesURL}/${email}/email`,
      Common.getHttpHeaders(),
    );
  }

  // Retrieve a message by its ID
  getMessageById(id: string | undefined | null): Observable<Message> {
    return this.httpClient.get<Message>(`${Resources.messagesURL}/${id}`, Common.getHttpHeaders());
  }

  // Add a message
  addMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSave(); // Remove these properties before saving the Message
    return this.httpClient.post<Message>(Resources.messagesURL, MESSAGE, Common.getHttpHeaders());
  }

  // Reply to a message
  replyOnMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSave(); // Remove these properties before saving the Message
    return this.httpClient.patch<Message>(
      `${Resources.messagesURL}/${message._id}/daterep`,
      MESSAGE,
      Common.getHttpHeaders(),
    );
  }

  // Show a message
  showMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSave(); // Remove these properties before saving the Message
    MESSAGE.visible = true;
    return this.httpClient.patch<Message>(
      `${Resources.messagesURL}/${message._id}/visible`,
      MESSAGE,
      Common.getHttpHeaders(),
    );
  }

  // Hide a message
  hideMessage(message: Message): Observable<Message> {
    const MESSAGE = message.removeBeforeSave(); // Remove these properties before saving the Message
    MESSAGE.visible = false;
    return this.httpClient.patch<Message>(
      `${Resources.messagesURL}/${message._id}/visible`,
      MESSAGE,
      Common.getHttpHeaders(),
    );
  }

  // Delete a message
  deleteMessage(id: string | undefined | null): Observable<Message> {
    return this.httpClient.delete<Message>(
      `${Resources.messagesURL}/${id}`,
      Common.getHttpHeaders(),
    );
  }
}
