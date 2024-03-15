import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  fetchComments(destinationId: number) {
    const apiUrl = environment.dbApiUrl;
    return this.http.get<any>(`${apiUrl}destination/${destinationId}/comments`);
  }

  postComment(destinationId: number, payload: any) {
    const apiUrl = environment.dbApiUrl;
    return this.http.post<any>(`${apiUrl}destination/${destinationId}/comments/`, { payload });
  }
}
