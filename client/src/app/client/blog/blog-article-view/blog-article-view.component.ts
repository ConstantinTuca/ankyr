import { Component } from '@angular/core';
import { faFolder } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-blog-article-view',
  standalone: true,
  imports: [],
  templateUrl: './blog-article-view.component.html',
  styleUrls: ['./blog-article-view.component.css']
})

export default class BlogArticleViewComponent {
  faFolder = faFolder;
  message = `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt vulputate metus non blandit. Donec luctus dapibus ornare. Duis sit amet odio eget nisl venenatis placerat eget eget diam. Maecenas mattis blandit mauris, id molestie felis posuere quis. Maecenas varius blandit consequat. Donec tincidunt dictum felis id egestas. Phasellus lorem turpis, vehicula quis enim vitae, commodo porta purus. Donec at pharetra lorem. </p>

    <p>Quisque faucibus dolor nec felis euismod scelerisque. Maecenas sit amet auctor purus. Fusce imperdiet mattis egestas. Duis justo sapien, scelerisque quis ante vel, rutrum vehicula dui. Proin eget leo eu est vestibulum viverra. Etiam arcu tortor, convallis ac scelerisque nec, condimentum sed velit. </p>

    <p>Duis justo sapien, scelerisque quis ante vel, rutrum vehicula dui. Proin eget leo eu est vestibulum viverra. Etiam arcu tortor, convallis ac scelerisque nec, condimentum sed velit. </p>

    <p>Quisque faucibus dolor nec felis euismod scelerisque. Maecenas sit amet auctor purus. Fusce imperdiet mattis egestas </p>

    <p>Maecenas sit amet auctor purus. Fusce imperdiet mattis egestas </p>

    <p>Quisque faucibus dolor nec felis euismod scelerisque. Maecenas sit amet auctor purus. Fusce imperdiet mattis egestas </p>

    <p>Quisque faucibus dolor nec felis euismod scelerisque. Maecenas sit amet auctor purus. Fusce imperdiet mattis egestas. Duis justo sapien, scelerisque quis ante vel, rutrum vehicula dui. Proin eget leo eu est vestibulum viverra. Etiam arcu tortor, convallis ac scelerisque nec, condimentum sed velit. </p>
    `
}