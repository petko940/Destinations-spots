import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  apiUrl = environment.dbApiUrl;
  
  constructor(private http: HttpClient) { }

  fetchRating(destinationId: number) {
    return this.http.get<any>(`${this.apiUrl}destination/${destinationId}/rating`);
  }

  fetchAllRatings() {
    return this.http.get<any>(`${this.apiUrl}all-ratings`);
  }

  postRating(destinationId: number, payload: any) {
    return this.http.post<any>(`${this.apiUrl}destination/${destinationId}/rating/`, payload);
  }

  deleteRating(destinationId: number, userId: number) {
    return this.http.delete<any>(`${this.apiUrl}destination/${destinationId}/rating/delete?user=${userId}`);
  }
}
