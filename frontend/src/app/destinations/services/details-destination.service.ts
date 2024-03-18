import { Injectable } from '@angular/core';
import { Destination } from '../../types/destination';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DetailsDestinationService {
  apiUrl = environment.dbApiUrl;
  
  destination!: Destination;
  destinationId!: number;

  constructor(private http: HttpClient) { }

  fetchDestination(destinationId: number) {
    return this.http.get<any>(`${this.apiUrl}destination/${destinationId}`);
  }

}
