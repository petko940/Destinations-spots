import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllDestinationsService {

  constructor(private http: HttpClient) { }

  fetchAllDestinations() {
    const apiUrl = environment.dbApiUrl;
    return this.http.get<any>(`${apiUrl}all-destinations/`);
  }
}
