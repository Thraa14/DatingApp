import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ToastrModule} from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component'
import { FormsModule } from '@angular/forms';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './home/register/register.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorsComponent } from './Errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './_Interceptors/error.interceptor';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_Interceptors/jwt.interceptor';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_Interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ListsComponent,
    MessagesComponent,
    MemberListComponent,
    MemberDetailComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
    ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
