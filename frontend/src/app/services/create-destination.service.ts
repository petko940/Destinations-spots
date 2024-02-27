import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateDestinationService {

  constructor(private http: HttpClient) { }

  getLocationCoordinates(latitude: number, longitude: number) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    return this.http.get(apiUrl);
  }

  formatLocation(response: any): string {
    let location = '';

    if (response.address) {
      if (response.address.village) {
        location = `${response.address.village}, `;
      } else if (response.address.town) {
        location = `${response.address.town}, `;
      } else if (response.address.suburb) {
        location = `${response.address.suburb}, `;
      } else if (response.address.hamlet) {
        location = `${response.address.hamlet}, `;
      }

      if (response.address.county) {
        location += `${response.address.county}, `;
      } else if (response.address.city) {
        location += `${response.address.city}, `;
      }

      if (response.address.province) {
        location += `${response.address.province}, `;
      }

      location += `${response.address.country}`;
    } else {
      location = 'Unknown! Choose another location!';
    }

    return location;
  }

  searchLocation(locationInput: string) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`;
    return this.http.get(apiUrl);
  }

  createDestination(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/create-destination/', data);
  }

}
