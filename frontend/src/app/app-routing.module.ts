import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CreateDestinationComponent } from './create-destination/create-destination.component';
import { AboutComponent } from './about/about.component';
import { AllDestinationsComponent } from './all-destinations/all-destinations.component';
import { DetailsDestinationComponent } from './details-destination/details-destination.component';

const routes: Routes = [
  { path: "about", component: AboutComponent },
  { path: "destinations", component: AllDestinationsComponent },
  { path: "destination/:id", component: DetailsDestinationComponent },
  { path: "create", component: CreateDestinationComponent },

  { path: "register", component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
