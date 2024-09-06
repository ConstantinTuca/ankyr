import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import HomeComponent from './client/home/home.component';
import BlogComponent from './client/blog/blog.component';
import BlogArticleViewComponent from './client/blog/blog-article-view/blog-article-view.component';
import ContactComponent from './client/contact/contact.component';
import ServicesComponent from './client/services/services.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'article-view', component: BlogArticleViewComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
