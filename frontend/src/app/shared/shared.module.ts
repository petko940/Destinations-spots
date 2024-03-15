import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { DeleteLoaderComponent } from './delete-loader/delete-loader.component';
import { EditLoadedComponent } from './edit-loaded/edit-loaded.component';


@NgModule({
  declarations: [
    LoaderComponent,
    DeleteLoaderComponent,
    EditLoadedComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoaderComponent,
    DeleteLoaderComponent,
    EditLoadedComponent,
  ]
})
export class SharedModule { }
