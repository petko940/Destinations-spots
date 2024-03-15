import { Injectable } from '@angular/core';
import { Destination } from '../../types/destination';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DetailsDestinationService {
  destination!: Destination;
  destinationId!: number;

  constructor(private http: HttpClient) { }

  fetchDestination(destinationId: number) {
    const apiUrl = environment.dbApiUrl;
    return this.http.get<any>(`${apiUrl}destination/${destinationId}`);
  }

}
