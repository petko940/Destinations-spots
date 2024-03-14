import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Destination } from '../../types/destination';

@Injectable({
  providedIn: 'root'
})
export class EditDestinationService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchDestinationData(destinationId: number) {
    const apiUrl = environment.dbApiUrl;
    return this.http.get<Destination>(`${apiUrl}edit-destination/${destinationId}`);
  }

  updateDestination(destinationId: number, data: any) {
    const apiUrl = environment.dbApiUrl;
    return this.http.put(`${apiUrl}edit-destination/${destinationId}/`, data);
  }
}
