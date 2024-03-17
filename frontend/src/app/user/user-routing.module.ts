import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EditUsernameComponent } from './edit-username/edit-username.component';

const routes: Routes = [
  { path: "profile", component: ProfileComponent },
  { path: "profile/edit-username", component: EditUsernameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
