import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Interest } from '../models/interest';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  // Destination / Address
  resourceURL: string = `${Resources.baseURL}/${Resources.interests}`;

  // Delivery
  private httpClient = inject(HttpClient);

  // Response: array of objects (list of interests)
  getAllInterests(): Observable<Interest[]> {
    return this.httpClient.get<Interest[]>(this.resourceURL);
  }

  // Response: interest object or null
  getInterestById(id: string | null): Observable<Interest> {
    return this.httpClient.get<Interest>(`${this.resourceURL}/${id}`);
  }

  // Response: string, boolean, object + ID
  addInterest(interest: Interest): Observable<Interest> {
    return this.httpClient.post<Interest>(this.resourceURL, interest);
  }

  // Response: string, boolean, object + ID
  updateInterest(interest: Interest): Observable<Interest> {
    return this.httpClient.put<Interest>(`${this.resourceURL}/${interest.id}`, interest);
  }

  // Response: string, boolean
  deleteInterest(id: string | null): Observable<Interest> {
    return this.httpClient.delete<Interest>(`${this.resourceURL}/${id}`);
  }
}
