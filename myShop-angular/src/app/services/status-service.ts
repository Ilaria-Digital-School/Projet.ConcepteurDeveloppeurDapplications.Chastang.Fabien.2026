import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  // Destination / Address
  statusURL: string = 'http://localhost:3000/status';

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of status)
  getAllStatus(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(this.statusURL);
  }

  // Response: status object or null
  getStatusById(id: string | null): Observable<Status> {
    return this.httpClient.get<Status>(`${this.statusURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addStatus(status: Status): Observable<Status> {
    return this.httpClient.post<Status>(this.statusURL, status);
  }

  // Response: string, boolean, object + ID
  updateStatus(status: Status): Observable<Status> {
    return this.httpClient.put<Status>(`${this.statusURL}/${status.id}`, status);
  }

  // Response: string, boolean
  deleteStatus(id: string | null): Observable<Status> {
    return this.httpClient.delete<Status>(`${this.statusURL}/${id}`);
  }
}
