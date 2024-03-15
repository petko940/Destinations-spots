import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeleteDestinationService } from '../services/delete-destination.service';
import { DetailsDestinationService } from '../services/details-destination.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-delete-destination',
    templateUrl: './delete-destination.component.html',
    styleUrl: './delete-destination.component.css'
})
export class DeleteDestinationComponent {
    deleteLoading: boolean = false;
    deleteErrorMessage: string = '';
    isDeleted: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<DeleteDestinationComponent>,
        private deleteDestinationService: DeleteDestinationService,
        private detailsDestinationService: DetailsDestinationService,
        private router: Router,
    ) { }

    deleteDestination() {
        const destinationId = this.detailsDestinationService.destinationId;
        this.deleteLoading = true;

        setTimeout(() => {
            this.deleteDestinationService.deleteDestination(destinationId)
                .subscribe(() => {
                    this.router.navigate(['/destinations']);
                    this.dialogRef.close();
                    this.deleteLoading = false;
                    this.isDeleted = true;
                }, error => {
                    console.log("Error: ", error);
                    this.deleteErrorMessage = 'An error occurred. Please try again.';
                    this.deleteLoading = false;
                    setTimeout(() => {
                        this.dialogRef.close();
                    }, 2000);
                })
        }, 3400);
    }
}
