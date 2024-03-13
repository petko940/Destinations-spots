import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AllDestinationsService } from '../../destinations/services/all-destinations.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
    username: string | null = this.authService.getCurrentUsername();
    // destinationsCount: number | null = this.allDestinationsService.fetchAllDestinations();

    constructor(
        private authService: AuthService,
        private allDestinationsService: AllDestinationsService,
        ) { }
}
