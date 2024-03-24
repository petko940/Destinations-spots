import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { DeleteLoaderComponent } from './delete-loader/delete-loader.component';
import { EditLoadedComponent } from './edit-loaded/edit-loaded.component';
import { SlicePipe } from './pipes/slice.pipe';
import { GetUsernamePipe } from './pipes/get-username.pipe';
import { ElapsedTimePipe } from './pipes/elapsed-time.pipe';


@NgModule({
  declarations: [
    LoaderComponent,
    DeleteLoaderComponent,
    EditLoadedComponent,
    SlicePipe,
    GetUsernamePipe,
    ElapsedTimePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoaderComponent,
    DeleteLoaderComponent,
    EditLoadedComponent,
    SlicePipe,
    GetUsernamePipe,
    ElapsedTimePipe,
  ]
})
export class SharedModule { }
