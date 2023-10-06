import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogEntryComponent } from './pages/blog-entry/blog-entry.component';
import { BlogFormComponent } from './pages/blog-form/blog-form.component';
import { BlogOverviewComponent } from './pages/blog-overview/blog-overview.component';
import { CreateBlogEntryComponent } from './pages/create-blog-entry/create-blog-entry.component';

const routes: Routes = [
  {path: '', component: BlogOverviewComponent},
  {path: 'blogEntry/:id', component: BlogEntryComponent},
  {path: 'manageEntries', component: CreateBlogEntryComponent},
  {path: 'entryForm/:id', component: BlogFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// const routes: Routes = [
//   {path: 'recipes/:id', component: RecipeDetailComponent},
//   {path: 'category/:id', component: CategoryDetailsComponent},
//   {path: 'addRecipe', component: RecipeAddComponent},
//   {path: 'addCategory', component: CategoryAddComponent},
//   {path: 'allRecipes', component: RecipeListComponent},
//   {path: '', component: CategoryListComponent}
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }