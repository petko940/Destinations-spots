import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllDestinationsComponent } from "./all-destinations/all-destinations.component";
import { DetailsDestinationComponent } from "./details-destination/details-destination.component";
import { CreateDestinationComponent } from "./create-destination/create-destination.component";
import { AuthGuard } from "../auth/auth.guard";
import { EditDestinationComponent } from "./edit-destination/edit-destination.component";

const routes: Routes = [
    { path: "create", component: CreateDestinationComponent, canActivate: [AuthGuard] },
    { path: "destinations", component: AllDestinationsComponent },
    { path: "destination/:id", component: DetailsDestinationComponent },
    { path: "edit-destination/:id", component: EditDestinationComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DestinationsRoutingModule { }
