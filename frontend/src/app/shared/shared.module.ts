import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { DeleteLoaderComponent } from './delete-loader/delete-loader.component';
import { EditLoadedComponent } from './edit-loaded/edit-loaded.component';
import { SlicePipe } from './pipes/slice.pipe';


@NgModule({
  declarations: [
    LoaderComponent,
    DeleteLoaderComponent,
    EditLoadedComponent,
    SlicePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoaderComponent,
    DeleteLoaderComponent,
    EditLoadedComponent,
    SlicePipe,
  ]
})
export class SharedModule { }
