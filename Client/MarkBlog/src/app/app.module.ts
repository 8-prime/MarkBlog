import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateBlogEntryComponent } from './pages/create-blog-entry/create-blog-entry.component';
import { BlogOverviewComponent } from './pages/blog-overview/blog-overview.component';
import { BlogEntryComponent } from './pages/blog-entry/blog-entry.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { MarkdownModule} from 'ngx-markdown';
import { BlogFormComponent } from './pages/blog-form/blog-form.component';
import { BlogInfoComponent } from './components/blog-info/blog-info.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBlogEntryComponent,
    BlogOverviewComponent,
    BlogEntryComponent,
    NavbarComponent,
    BlogFormComponent,
    BlogInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
