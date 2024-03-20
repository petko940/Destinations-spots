import { Component, OnInit, ViewChild } from '@angular/core';
import { Destination } from '../../types/destination';
import { RatingService } from '../services/rating.service';
import { Rating } from '../../types/rating';
import { AllDestinationsService } from '../services/all-destinations.service';
import { AuthService } from '../../auth/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-all-destinations',
    templateUrl: './all-destinations.component.html',
    styleUrl: './all-destinations.component.css'
})
export class AllDestinationsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    pageSize = 4;
    pageIndex = 0;
    destionationsCount: number = 0;
    displayedDestinations: Destination[] = [];

    isLoading: boolean = true;
    showMyDestinations: boolean = false;
    allDestinations: Destination[] = [];
    myDestinations: Destination[] = [];
    myDestinationCount: number = 0;

    copyAllDestinations: Destination[] = [];
    ratingsMap: { [destinationId: number]: Rating[] } = {};
    filledStarsMap: { [destinationId: number]: number[] } = {};
    remainingStarsMap: { [destinationId: number]: number[] } = {};

    isLoggedIn: boolean = this.authService.isLoggedIn();

    constructor(
        private authService: AuthService,
        private allDestinationsService: AllDestinationsService,
        private ratingService: RatingService,
    ) { }

    ngOnInit() {
        this.fetchAllDestinations();
        this.updateDisplayedDestinations();
    }

    fetchAllDestinations() {
        this.allDestinationsService.fetchAllDestinations()
            .subscribe((response: any) => {
                this.destionationsCount = response.length;
                this.isLoading = false;
                this.allDestinations = response.sort((a: Destination, b: Destination) => b.id - a.id)
                this.copyAllDestinations = [...this.allDestinations];
                this.fetchRatingsForDestinations();

                this.updateDisplayedDestinations();

            }, error => {
                this.isLoading = false
                console.log(error);
            });

    }

    fetchRatingsForDestinations() {
        this.allDestinations.forEach(destination => {
            this.ratingService.fetchRating(destination.id)
                .subscribe(ratings => {
                    this.ratingsMap[destination.id] = ratings;
                    this.calculateRatings(destination.id);
                }, error => {
                    console.error('Error fetching ratings for destination:', destination.id, error);
                });
        });
    }

    calculateRatings(destinationId: number): void {
        let averageRating = 0;
        this.ratingsMap[destinationId].forEach(element => {
            averageRating += element.stars;
        });
        if (averageRating === 0) {
            this.filledStarsMap[destinationId] = [];
            this.remainingStarsMap[destinationId] = Array(5).fill(0);
            return
        }
        const filledStars = Array(Math.round(averageRating / this.ratingsMap[destinationId].length)).fill(0);
        const remainingStars = Array(5 - filledStars.length).fill(0);
        this.filledStarsMap[destinationId] = filledStars;
        this.remainingStarsMap[destinationId] = remainingStars;
    }

    toggleShowMyDestinations() {
        this.showMyDestinations = !this.showMyDestinations

        if (this.showMyDestinations) {
            this.myDestinations = this.allDestinations.filter(destination => destination.user.toString() == this.authService.getCurrentUserId());
            this.allDestinations = [...this.myDestinations];
            this.destionationsCount = this.myDestinations.length;
        } else {
            this.allDestinations = [...this.copyAllDestinations];
            this.destionationsCount = this.allDestinations.length;
        }

        this.pageIndex = 0;
        this.updateDisplayedDestinations();
        this.paginator.firstPage();
    }

    onPageChange(e: PageEvent) {
        this.pageIndex = e.pageIndex;
        this.updateDisplayedDestinations();
    }

    updateDisplayedDestinations() {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.destionationsCount);
        this.displayedDestinations = this.allDestinations.slice(startIndex, endIndex);
    }


}
