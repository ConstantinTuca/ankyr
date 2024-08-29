import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import ContactComponent from './contact/contact.component';
import HeaderComponent from './header/header.component';
import FooterComponent from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      progressBar: true,
      closeButton: true,
      enableHtml: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    NgxSpinnerModule
  ]
})
export class AppModule { }
