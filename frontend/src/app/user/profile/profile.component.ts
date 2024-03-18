import { Component, OnChanges } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AllDestinationsService } from '../../destinations/services/all-destinations.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUsernameComponent } from '../edit-username/edit-username.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
    username: string | null = this.authService.getCurrentUsername();
    // destinationsCount: number | null = this.allDestinationsService.fetchAllDestinations();
    isLoggedIn: boolean = this.authService.isLoggedIn();

    constructor(
        private authService: AuthService,
        private allDestinationsService: AllDestinationsService,
    ) { }

}
