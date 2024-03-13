import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DeleteDestinationService {

  constructor(private http: HttpClient) { }

  deleteDestination(destinationId: number) {
    const apiUrl: string = environment.dbApiUrl;
    return this.http.delete(apiUrl + 'delete-destination/' + destinationId);
  }
}
