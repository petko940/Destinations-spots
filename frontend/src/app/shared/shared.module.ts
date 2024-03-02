import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { LoaderComponent } from './loader/loader.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NavigationComponent, 
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavigationComponent,
    LoaderComponent,
    RouterModule
  ]
})
export class SharedModule { }
