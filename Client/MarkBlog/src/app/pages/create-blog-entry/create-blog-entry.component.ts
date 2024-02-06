import { Component, inject } from '@angular/core';
import { ArticleShell } from 'src/app/classes/article-shell';
import { BlogService } from 'src/app/services/blog.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-create-blog-entry',
  templateUrl: './create-blog-entry.component.html',
  styleUrls: ['./create-blog-entry.component.css']
})
export class CreateBlogEntryComponent {
  entries: ArticleShell[] = []

  loginService = inject(LoginService);
  
  constructor(private blogservice: BlogService){}
  
  
  ngOnInit(): void {
    this.loadData();
  }
  remove(id?: number): void {
    if(id){
      this.blogservice.removeEntry(id).subscribe(() => this.loadData());
    }
  }

  loadData(): void {
    this.blogservice.getAllArticlesForUser(this.loginService.getUserId()).subscribe(data => this.entries = data);
  }
}
