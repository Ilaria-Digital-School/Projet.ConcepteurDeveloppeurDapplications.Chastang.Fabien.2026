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

  // Retrieve all status
  getAllStatus(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(Resources.statusURL);
  }

  // Add a status
  addStatus(status: Status): Observable<Status> {
    return this.httpClient.post<Status>(Resources.statusURL, status);
  }

  // Update a status
  updateStatus(status: Status): Observable<Status> {
    return this.httpClient.put<Status>(`${Resources.statusURL}/${status.id}`, status);
  }

  // Delete a status
  deleteStatus(id: string | null): Observable<Status> {
    return this.httpClient.delete<Status>(`${Resources.statusURL}/${id}`);
  }
}
