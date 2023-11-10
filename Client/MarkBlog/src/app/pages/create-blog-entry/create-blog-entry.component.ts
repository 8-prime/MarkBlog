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
    this.loadData();
  }
  remove(id?: string): void {
    if(id){
      this.blogservice.removeEnrty(id).subscribe(() => this.loadData());
    }
  }

  loadData(): void {
    this.blogservice.getAllEntriesForUser().subscribe(data => this.entries = data);
  }
}
