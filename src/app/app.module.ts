import { environment } from 'src/environments/environment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { I18nModule } from './modules/i18n/i18n.module';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './modules/app.routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UploadComponent } from './components/upload/upload.component';
import { CreateComponent } from './components/create/create.component';
import { MapComponent } from './components/map/map.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConcessionDashboardComponent } from './components/concession-dashboard/concession-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadComponent,
    CreateComponent,
    MapComponent,
    ConcessionDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    I18nModule,
    LoggerModule.forRoot({
      level:environment.logLevel
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAyhTZbdWCv56vTg_nne2UIPHhQKZb5V6w'
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
