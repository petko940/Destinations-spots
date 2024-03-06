import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDestinationComponent } from './create-destination/create-destination.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AllDestinationsComponent } from './all-destinations/all-destinations.component';



@NgModule({
  declarations: [
    CreateDestinationComponent,
    AllDestinationsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    CreateDestinationComponent,
    AllDestinationsComponent,
  ]
})
export class DestinationsModule { }
