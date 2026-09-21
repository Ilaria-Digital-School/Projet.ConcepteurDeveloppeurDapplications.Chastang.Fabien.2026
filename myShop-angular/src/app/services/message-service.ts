import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Message } from '../models/message';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.messagesURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // Retrieve a message by its user email
  getMessagesByEmail(email: string | null): Observable<Message> {
    return this.httpClient.get<Message>(`${this.url}/${email}/email`, this.httpHeaders);
  }

  // Retrieve a message by its ID
  getMessageById(id: string | undefined | null): Observable<Message> {
    return this.httpClient.get<Message>(`${this.url}/${id}`, this.httpHeaders);
  }

  // Add a message
  addMessage(message: Message): Observable<Message> {
    // Remove these properties before saving the Message
    const MESSAGE = message.removeBeforeSave();
    return this.httpClient.post<Message>(this.url, MESSAGE, this.httpHeaders);
  }

  // Reply to a message
  replyOnMessage(message: Message): Observable<Message> {
    // Remove these properties before saving the Message
    const MESSAGE = message.removeBeforeSave();
    const URL = `${this.url}/${message._id}/daterep`;
    return this.httpClient.patch<Message>(URL, MESSAGE, this.httpHeaders);
  }

  // Show a message
  showMessage(message: Message): Observable<Message> {
    // Remove these properties before saving the Message
    const MESSAGE = message.removeBeforeSave();
    // Show the item
    MESSAGE.visible = true;
    const URL = `${this.url}/${message._id}/visible`;
    return this.httpClient.patch<Message>(URL, MESSAGE, this.httpHeaders);
  }

  // Hide a message
  hideMessage(message: Message): Observable<Message> {
    // Remove these properties before saving the Message
    const MESSAGE = message.removeBeforeSave();
    // Hide the item
    MESSAGE.visible = false;
    const URL = `${this.url}/${message._id}/visible`;
    return this.httpClient.patch<Message>(URL, MESSAGE, this.httpHeaders);
  }

  // Delete a message
  deleteMessage(id: string | undefined | null): Observable<Message> {
    return this.httpClient.delete<Message>(`${this.url}/${id}`, this.httpHeaders);
  }
}
