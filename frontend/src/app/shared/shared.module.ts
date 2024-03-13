import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { DeleteLoaderComponent } from './delete-loader/delete-loader.component';


@NgModule({
  declarations: [
    LoaderComponent,
    DeleteLoaderComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoaderComponent,
    DeleteLoaderComponent,
  ]
})
export class SharedModule { }
