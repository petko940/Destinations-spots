import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = environment.dbApiUrl;

  searchValue: string = '';

  constructor(
    private http: HttpClient,
  ) { }

  search(searchText: string) {
    return this.http.get<any>(`${this.apiUrl}search`, { params: { result: searchText } });
  }
}
