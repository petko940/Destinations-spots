import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllDestinationsService {
  private apiUrl = environment.dbApiUrl
  constructor(private http: HttpClient) { }

  fetchAllDestinations() {
    return this.http.get<any>(`${this.apiUrl}all-destinations/`);
  }

  fetchMostRecentCreatedDestinations() {
    return this.http.get<any>(`${this.apiUrl}most-recent-created-destinations/`);
  }
}
