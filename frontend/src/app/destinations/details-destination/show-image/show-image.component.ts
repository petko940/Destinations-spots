import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetailsDestinationComponent } from '../details-destination.component';

@Component({
    selector: 'app-show-image',
    templateUrl: './show-image.component.html',
})
export class ShowImageComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DetailsDestinationComponent>
    ) {
        console.log(data.destination.photo);
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
