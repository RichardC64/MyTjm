import { AuthInterceptorService } from './_services/infra/auth-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CallbackComponent } from './callback/callback.component';
import { ClientsComponent } from './clients/clients.component';
import { NewClientComponent } from './clients/new-client.component';
import { HttpSrcDirective } from './directives/http-src.directive';
import { HomeComponent } from './home/home.component';
import { NewTjmEventComponent } from './home/new-tjm-event.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { MsConnectComponent } from './ms-connect/ms-connect.component';
import { ParametersComponent } from './parameters/parameters.component';
import { DayBackgroundPipe } from './pipes/day-background.pipe';
import { DayPositionPipe } from './pipes/day-position.pipe';
import { EventColorPipe } from './pipes/event-color.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    LeftPanelComponent,
    ParametersComponent,
    MsConnectComponent,
    ClientsComponent,
    NewClientComponent,
    NewTjmEventComponent,
    KeysPipe,
    EventColorPipe,
    DayBackgroundPipe,
    InvoicesComponent,
    DayPositionPipe,
    LoginComponent,
    HttpSrcDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [NewClientComponent, NewTjmEventComponent]
})
export class AppModule { }
