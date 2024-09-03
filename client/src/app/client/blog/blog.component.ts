import { Component } from '@angular/core';
import BlogCardComponent from './blog-card/blog-card.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ BlogCardComponent ],
  templateUrl: 'blog.component.html',
  styleUrls: ['./blog.component.css']
})

export default class BlogComponent {}