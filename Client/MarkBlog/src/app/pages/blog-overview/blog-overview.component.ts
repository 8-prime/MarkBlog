import { Component } from '@angular/core';
import { ArticleShell } from 'src/app/classes/article-shell';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-overview',
  templateUrl: './blog-overview.component.html',
  styleUrls: ['./blog-overview.component.css']
})
export class BlogOverviewComponent {
  entries: ArticleShell[] = []

  constructor(private blogservice: BlogService){}

  ngOnInit(): void {
    this.blogservice.getAllArticles().subscribe(data => this.entries = data);
  }

  onTextChange(changedText: string) {
    if(changedText === ''){
      this.blogservice.getAllArticles().subscribe(data => this.entries = data);
    }
    else{
      this.blogservice.getAllEntriesForSearch(changedText).subscribe(data => this.entries = data);
    }
  }
}
