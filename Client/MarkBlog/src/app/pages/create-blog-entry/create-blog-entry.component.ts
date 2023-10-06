import { Component } from '@angular/core';
import { BlogEntry } from 'src/app/classes/blog-entry';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-create-blog-entry',
  templateUrl: './create-blog-entry.component.html',
  styleUrls: ['./create-blog-entry.component.css']
})
export class CreateBlogEntryComponent {
  entries: BlogEntry[] = []

  constructor(private blogservice: BlogService){}

  ngOnInit(): void {
    this.blogservice.getAllEntries().subscribe(data => this.entries = data);
  }
}
