import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogEntryComponent } from './pages/blog-entry/blog-entry.component';
import { BlogFormComponent } from './pages/blog-form/blog-form.component';
import { BlogOverviewComponent } from './pages/blog-overview/blog-overview.component';
import { CreateBlogEntryComponent } from './pages/create-blog-entry/create-blog-entry.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuardService } from './routeguards/auth-guard-service';

const routes: Routes = [
  {path: '', component: BlogOverviewComponent},
  {path: 'blogEntry/:id', component: BlogEntryComponent},
  {path: 'manageEntries', component: CreateBlogEntryComponent, canActivate: [AuthGuardService]},
  {path: 'entryForm/:id', component: BlogFormComponent, canActivate: [AuthGuardService]},
  {path: 'user', component: UserComponent,  canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }