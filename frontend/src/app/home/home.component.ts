import { Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';
import { AllDestinationsService } from '../destinations/services/all-destinations.service';
import { RatingService } from '../destinations/services/rating.service';
import { Rating } from '../types/rating';
import { DetailsDestinationService } from '../destinations/services/details-destination.service';
import { DetailsDestinationComponent } from '../destinations/details-destination/details-destination.component';
import { forkJoin } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    destinations: Destination[] = [];
    destinationsRatings: any = {};

    constructor(
        private allDestinationsService: AllDestinationsService,
        private ratingService: RatingService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.fetchAllDestinations();

    }

    fetchAllDestinations() {
        this.allDestinationsService.fetchAllDestinations()
            .subscribe((response: []) => {
                const observables = response.map((dest: Destination) =>
                    this.ratingService.fetchRating(dest.id)
                );

                forkJoin(observables)
                    .subscribe((data: any[]) => {
                        data.forEach((ratingData, index) => {
                            const dest: Destination = response[index];
                            let totalStars = 0;
                            ratingData.forEach((r: Rating) => {
                                totalStars += r.stars;
                            });
                            this.destinationsRatings[dest.id] = totalStars / ratingData.length;
                        });

                        this.sortedDestinationsByRating();
                    });
            }, error => {
                console.log(error);
            });
    }

    sortedDestinationsByRating() {
        const ratingsArray = Object.entries(this.destinationsRatings);

        ratingsArray.sort((a: any, b: any) => b[1] - a[1]);

        console.log(ratingsArray.slice(0, 2));
    }


}
