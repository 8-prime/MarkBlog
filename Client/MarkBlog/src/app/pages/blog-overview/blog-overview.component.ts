import { Component, OnInit } from '@angular/core';
import { BlogEntry } from 'src/app/classes/blog-entry';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-overview',
  templateUrl: './blog-overview.component.html',
  styleUrls: ['./blog-overview.component.css']
})
export class BlogOverviewComponent {
  entries: BlogEntry[] = []

  constructor(private blogservice: BlogService){}

  ngOnInit(): void {
    this.blogservice.getAllEntries().subscribe(data => this.entries = data);
  }
}
