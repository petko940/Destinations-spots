import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about/about.component';
import { CoreModule } from './core/core.module';
import { DestinationsModule } from './destinations/destinations.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { SearchComponent } from './search/search.component';
import { AppInterceptor } from './app.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    ErrorComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    CoreModule,
    SharedModule,
    DestinationsModule,
    // AuthModule,
    UserModule,

    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
