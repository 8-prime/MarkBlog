import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from  '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateBlogEntryComponent } from './pages/create-blog-entry/create-blog-entry.component';
import { BlogOverviewComponent } from './pages/blog-overview/blog-overview.component';
import { BlogEntryComponent } from './pages/blog-entry/blog-entry.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { MarkdownModule} from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';
import { BlogFormComponent } from './pages/blog-form/blog-form.component';
import { BlogInfoComponent } from './components/blog-info/blog-info.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtInterceptor } from './interceptors/auth-interceptor';
import { AuthGuardService } from './routeguards/auth-guard-service';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBlogEntryComponent,
    BlogOverviewComponent,
    BlogEntryComponent,
    NavbarComponent,
    BlogFormComponent,
    BlogInfoComponent,
    SearchbarComponent,
    LoginComponent,
    UserComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-bottom-center'
    }), // ToastrModule added
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
