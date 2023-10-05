import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateBlogEntryComponent } from './pages/create-blog-entry/create-blog-entry.component';
import { BlogOverviewComponent } from './pages/blog-overview/blog-overview.component';
import { BlogEntryComponent } from './pages/blog-entry/blog-entry.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBlogEntryComponent,
    BlogOverviewComponent,
    BlogEntryComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
