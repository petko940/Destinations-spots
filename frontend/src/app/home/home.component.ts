import { Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';
import { AllDestinationsService } from '../destinations/services/all-destinations.service';
import { RatingService } from '../destinations/services/rating.service';
import { Rating } from '../types/rating';
import { DetailsDestinationService } from '../destinations/services/details-destination.service';
import { DetailsDestinationComponent } from '../destinations/details-destination/details-destination.component';
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

    constructor(
        private allDestinationsService: AllDestinationsService,
        private ratingService: RatingService,
        private detailsDestinationService: DetailsDestinationService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.fetchAverageRatingPerDestination();

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

}