import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Status } from '../models/status';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // NO TOKEN - Retrieve all status
  getAllStatus(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(Resources.statusURL);
  }

  // Add a status
  addStatus(status: Status): Observable<Status> {
    return this.httpClient.post<Status>(Resources.statusURL, status, Common.getHttpHeaders());
  }

  // Update a status
  updateStatus(status: Status): Observable<Status> {
    return this.httpClient.put<Status>(
      `${Resources.statusURL}/${status._id}`,
      status,
      Common.getHttpHeaders(),
    );
  }

  // Delete a status
  deleteStatus(id: string | null): Observable<Status> {
    return this.httpClient.delete<Status>(`${Resources.statusURL}/${id}`, Common.getHttpHeaders());
  }
}
