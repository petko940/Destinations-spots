import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDestinationComponent } from './create-destination/create-destination.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllDestinationsComponent } from './all-destinations/all-destinations.component';
import { DetailsDestinationComponent } from './details-destination/details-destination.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DestinationsRoutingModule } from './destinations-routing.module';
import { EditDestinationComponent } from './edit-destination/edit-destination.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule, } from '@angular/material/dialog';
import { DeleteDestinationComponent } from './delete-destination/delete-destination.component';
import { ShowImageComponent } from './details-destination/show-image/show-image.component';
import { AllDestinationsPipe } from './all-destinations/all-destinations.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    CreateDestinationComponent,
    AllDestinationsComponent,
    DetailsDestinationComponent,
    EditDestinationComponent,
    DeleteDestinationComponent,
    ShowImageComponent,
    AllDestinationsPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatPaginatorModule,
    RouterModule,
  ],
  exports: [
    CreateDestinationComponent,
    AllDestinationsComponent,
    DetailsDestinationComponent,
    EditDestinationComponent,
    DeleteDestinationComponent,
    DestinationsRoutingModule,
    MatDialogModule
  ],
  providers: [
    CreateDestinationComponent,
    DetailsDestinationComponent
  ],
})
export class DestinationsModule { }
