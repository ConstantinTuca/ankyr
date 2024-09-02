import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import HomeComponent from './home/home.component';
import BlogComponent from './blog/blog.component';
import ContactComponent from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
