import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.status}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of status)
  getAllStatus(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(this.resourceURL);
  }

  // Response: status object or null
  getStatusById(id: string | null): Observable<Status> {
    return this.httpClient.get<Status>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addStatus(status: Status): Observable<Status> {
    return this.httpClient.post<Status>(this.resourceURL, status);
  }

  // Response: string, boolean, object + ID
  updateStatus(status: Status): Observable<Status> {
    return this.httpClient.put<Status>(`${this.resourceURL}/${status.id}`, status);
  }

  // Response: string, boolean
  deleteStatus(id: string | null): Observable<Status> {
    return this.httpClient.delete<Status>(`${this.resourceURL}/${id}`);
  }
}
