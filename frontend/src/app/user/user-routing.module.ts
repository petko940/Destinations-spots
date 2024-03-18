import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EditUsernameComponent } from './edit-username/edit-username.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: "profile/:username", component: ProfileComponent },
  { path: "profile/:username/edit-username", component: EditUsernameComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
