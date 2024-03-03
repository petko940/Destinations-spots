import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-all-destinations',
    templateUrl: './all-destinations.component.html',
    styleUrl: './all-destinations.component.css'
})
export class AllDestinationsComponent implements OnInit {
    isLoading: boolean = true;
    showMyDestinations: boolean = false;
    allDestinations: Destination[] = [];
    myDestinations: Destination[] = [];
    originalDestinations : Destination[] = [];

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.http.get('http://127.0.0.1:8000/api/all-destinations/')
            .subscribe((response: any) => {
                this.isLoading = false
                this.allDestinations = response.sort((a: Destination, b: Destination) => b.id - a.id);
                this.originalDestinations  = [...this.allDestinations];
            }, error => {
                this.isLoading = false
                console.log(error);
            });
    }

    toggleShowMyDestinations() {
        this.showMyDestinations = !this.showMyDestinations

        if (this.showMyDestinations) {
            this.myDestinations = this.allDestinations.filter(destination => destination.user == this.authenticationService.getCurrentUser().id);
            this.allDestinations = [...this.myDestinations]; 
        } else {
            this.allDestinations = [...this.originalDestinations]; 
        }

    }

}
