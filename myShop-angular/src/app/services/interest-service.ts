import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resources } from '../api.config';
import { Interest } from '../models/interest';
import { HTTPHeaders, Common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  // Performs HTTP requests
  private httpClient: HttpClient = inject(HttpClient);
  private url: string = Resources.interestsURL;
  // HTTP headers for transmitting the token: using an HttpOnly, Secure,
  // and SameSite=Strict cookie is a much better practice
  private httpHeaders: HTTPHeaders = Common.getHttpHeaders();

  // NO TOKEN - Retrieve all user interests / product types
  getAllInterests(): Observable<Interest[]> {
    return this.httpClient.get<Interest[]>(this.url);
  }

  // Add a user interest / product type
  addInterest(interest: Interest): Observable<Interest> {
    // Remove the _id before saving the Interest
    const INTEREST = interest.removeBeforeSave();
    return this.httpClient.post<Interest>(this.url, INTEREST, this.httpHeaders);
  }

  // Update a user interest / product type
  updateInterest(interest: Interest): Observable<Interest> {
    // Remove the _id before saving the Interest
    const INTEREST = interest.removeBeforeSave();
    return this.httpClient.put<Interest>(`${this.url}/${interest._id}`, INTEREST, this.httpHeaders);
  }

  // Delete a user interest / product type
  deleteInterest(id: string | null): Observable<Interest> {
    return this.httpClient.delete<Interest>(`${this.url}/${id}`, this.httpHeaders);
  }
}
