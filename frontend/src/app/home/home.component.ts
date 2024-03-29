import { Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';
import { AllDestinationsService } from '../destinations/services/all-destinations.service';
import { RatingService } from '../destinations/services/rating.service';
import { DetailsDestinationService } from '../destinations/services/details-destination.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    isLoading = true;

    destinationsWithHighestRating: Destination[] | any = [];
    allRatings = [];

    mostRecentCreatedDestinations: Destination[] = [];

    constructor(
        private allDestinationsService: AllDestinationsService,
        private ratingService: RatingService,
        private detailsDestinationService: DetailsDestinationService,
    ) { }

    ngOnInit() {
        this.fetchAverageRatingPerDestination();
        this.fetchMostRecentCreatedDestinations();
    }

    fetchAverageRatingPerDestination() {
        this.ratingService.fetchAllRatings()
            .subscribe((response: any) => {
                this.allRatings = response;

                Object.values(this.allRatings).forEach((value: any) => {
                    const destId = value['destination_id'];
                    this.fetchDestinationsWithBestRating(destId, value['average_stars']);

                });
                this.isLoading = false;

            }, error => {
                this.isLoading = false;
                this.fetchAverageRatingPerDestination();
                console.log(error);
            })
    }

    fetchDestinationsWithBestRating(destinationId: number, averageStars: number) {
        this.detailsDestinationService.fetchDestination(destinationId).
            subscribe((response: any) => {
                averageStars = Math.round(averageStars);
                const destinationWithRating = {
                    ...response,
                    averageStars
                }
                this.destinationsWithHighestRating.push(destinationWithRating);

                this.destinationsWithHighestRating = this.destinationsWithHighestRating.sort((a: any, b: any) => b.averageStars - a.averageStars);
            });
    }

    showStars(averageStars: number) {
        const starsArray = [];
        for (let i = 0; i < averageStars; i++) {
            starsArray.push(i);
        }
        return starsArray;
    }

    fetchMostRecentCreatedDestinations() {
        this.allDestinationsService.fetchMostRecentCreatedDestinations()
            .subscribe((response: any) => {
                this.mostRecentCreatedDestinations = response;
            }, error => {
                this.isLoading = false;
                this.fetchMostRecentCreatedDestinations();
                console.log(error);
            })
    }

}