import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  fetchRating(destinationId: number) {
    const apiUrl = environment.dbApiUrl;
    return this.http.get<any>(`${apiUrl}destination/${destinationId}/rating`);
  }

  postRating(destinationId: number, payload: any) {
    const apiUrl = environment.dbApiUrl;
    return this.http.post<any>(`${apiUrl}destination/${destinationId}/rating/`, payload);
  }

  deleteRating(destinationId: number, userId: number) {
    const apiUrl = environment.dbApiUrl;
    return this.http.delete<any>(`${apiUrl}destination/${destinationId}/rating/delete?user=${userId}`);
  }
}
