import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Resources URL
  statusURL: string = `${Resources.baseURL}/${Resources.status}`;

  // Retrieve all status
  getAllStatus(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(this.statusURL);
  }

  // Add a status
  addStatus(status: Status): Observable<Status> {
    return this.httpClient.post<Status>(this.statusURL, status);
  }

  // Update a status
  updateStatus(status: Status): Observable<Status> {
    return this.httpClient.put<Status>(`${this.statusURL}/${status.id}`, status);
  }

  // Delete a status
  deleteStatus(id: string | null): Observable<Status> {
    return this.httpClient.delete<Status>(`${this.statusURL}/${id}`);
  }
}
