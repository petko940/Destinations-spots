import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CreateDestinationComponent } from './create-destination/create-destination.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: "about", component: AboutComponent },

  { path: "create", component: CreateDestinationComponent },

  { path: "register", component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
