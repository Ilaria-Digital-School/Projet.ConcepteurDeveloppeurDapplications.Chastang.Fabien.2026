import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Status } from '../models/status';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.statusURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all status
  getAllStatus(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(this.url);
  }

  // Add a status
  addStatus(status: Status): Observable<Status> {
    // Remove the _id before saving the Status
    const STATUS = status.removeBeforeSave();
    return this.httpClient.post<Status>(this.url, STATUS, this.httpHeaders);
  }

  // Update a status
  updateStatus(status: Status): Observable<Status> {
    // Remove the _id before saving the Status
    const STATUS = status.removeBeforeSave();
    return this.httpClient.put<Status>(`${this.url}/${status._id}`, STATUS, this.httpHeaders);
  }

  // Delete a status
  deleteStatus(id: string | null): Observable<Status> {
    return this.httpClient.delete<Status>(`${this.url}/${id}`, this.httpHeaders);
  }
}
