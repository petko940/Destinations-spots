import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';

@Component({
    selector: 'app-all-destinations',
    templateUrl: './all-destinations.component.html',
    styleUrl: './all-destinations.component.css'
})
export class AllDestinationsComponent implements OnInit {
    isLoading: boolean = true;
    showMyDestinations: boolean = false;
    allDestinations: Destination[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get('http://127.0.0.1:8000/api/all-destinations/')
            .subscribe((response: any) => {
                this.isLoading = false
                this.allDestinations = response.sort((a: Destination, b: Destination) => b.id - a.id);;
                console.log(this.allDestinations);
            }, error => {
                this.isLoading = false
                console.log(error);
            });
    }

    toggleShowMyDestinations() {
        console.log(this.showMyDestinations);
        this.showMyDestinations = !this.showMyDestinations
    }

}
