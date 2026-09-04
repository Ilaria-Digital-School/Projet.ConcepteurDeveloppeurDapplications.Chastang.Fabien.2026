import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Interest } from '../models/interest';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // Retrieve all user interests / product types
  getAllInterests(): Observable<Interest[]> {
    return this.httpClient.get<Interest[]>(Resources.interestsURL);
  }

  // Add a user interest / product type
  addInterest(interest: Interest): Observable<Interest> {
    return this.httpClient.post<Interest>(Resources.interestsURL, interest);
  }

  // Update a user interest / product type
  updateInterest(interest: Interest): Observable<Interest> {
    return this.httpClient.put<Interest>(`${Resources.interestsURL}/${interest.id}`, interest);
  }

  // Delete a user interest / product type
  deleteInterest(id: string | null): Observable<Interest> {
    return this.httpClient.delete<Interest>(`${Resources.interestsURL}/${id}`);
  }
}
