import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Interest } from '../models/interest';
import { Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  // Performs HTTP requests
  private httpClient = inject(HttpClient);

  // NO TOKEN - Retrieve all user interests / product types
  getAllInterests(): Observable<Interest[]> {
    return this.httpClient.get<Interest[]>(Resources.interestsURL);
  }

  // Add a user interest / product type
  addInterest(interest: Interest): Observable<Interest> {
    const INTEREST = interest.removeBeforeSave(); // Remove the _id before saving the Interest
    return this.httpClient.post<Interest>(
      Resources.interestsURL,
      INTEREST,
      Common.getHttpHeaders(),
    );
  }

  // Update a user interest / product type
  updateInterest(interest: Interest): Observable<Interest> {
    const INTEREST = interest.removeBeforeSave(); // Remove the _id before saving the Interest
    return this.httpClient.put<Interest>(
      `${Resources.interestsURL}/${interest._id}`,
      INTEREST,
      Common.getHttpHeaders(),
    );
  }

  // Delete a user interest / product type
  deleteInterest(id: string | null): Observable<Interest> {
    return this.httpClient.delete<Interest>(
      `${Resources.interestsURL}/${id}`,
      Common.getHttpHeaders(),
    );
  }
}
