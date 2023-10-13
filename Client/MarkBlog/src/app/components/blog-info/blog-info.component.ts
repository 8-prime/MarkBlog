import { Component, Input } from '@angular/core';
import { BlogEntry } from 'src/app/classes/blog-entry';

@Component({
  selector: 'app-blog-info',
  templateUrl: './blog-info.component.html',
  styleUrls: ['./blog-info.component.css']
})
export class BlogInfoComponent {
  @Input() blogEntry?: BlogEntry


  getReadingDuration() : number {
    return Math.max(Math.round((this.blogEntry?.markdowntext.split(' ').length ?? 0) / 200), 1); 
  }
}
