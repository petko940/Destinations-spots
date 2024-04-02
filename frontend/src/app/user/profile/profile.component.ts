import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AllDestinationsService } from '../../destinations/services/all-destinations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../destinations/services/rating.service';
import { Destination } from '../../types/destination';
import { UserService } from '../user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    currentUsername!: string | null;

    isLoggedIn!: boolean;
    isCurrentUserProfile!: boolean;
    notCurrentUserProfile!: boolean | null | string;

    destsCount!: number;
    ratingsCount!: number;

    destinationsByUser!: Destination[];
    username!: any;

    constructor(
        private authService: AuthService,
        private allDestinationsService: AllDestinationsService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.currentUsername = this.authService.getCurrentUsername();
        this.isLoggedIn = this.authService.isLoggedIn();

        this.route.params.subscribe(params => {
            this.username = params['username'];
            this.isCurrentUserProfile = this.currentUsername === this.username;
            this.notCurrentUserProfile = null;
            if (!this.isCurrentUserProfile) {
                this.notCurrentUserProfile = this.username;
            };

            if (this.isCurrentUserProfile) {
                this.destinationsCount();
                this.ratingsByCurrentUser();
            };

        });
        this.destinationsCount();
    }

    destinationsCount() {
        let userId: number;
        this.authService.getUserIdByUsername(this.username)
            .subscribe((response: any) => {                
                userId = response.id;
                if (!userId) {
                    this.router.navigate(['/404']);
                }
                
                this.allDestinationsService.fetchAllDestinations()
                    .subscribe((response: Destination[]) => {
                        this.destinationsByUser = response.filter(d => d.user === userId);
                        this.destsCount = this.destinationsByUser.length;

                    }, error => {
                        console.log(error);
                    })
            }, error => {
                console.log(error);                
                this.router.navigate(['/404']);
            })



    }

    ratingsByCurrentUser() {
        this.userService.getAllRatingsByUser(this.authService.getCurrentUserId())
            .subscribe((response: any) => {
                this.ratingsCount = response.length;

            }, error => {
                console.log(error);
            })
    }
}
