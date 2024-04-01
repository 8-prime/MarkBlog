import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleModel } from 'src/app/classes/article-model';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent {
  entry: ArticleModel | undefined = undefined;

  blogservice = inject(BlogService);
  route = inject(ActivatedRoute)


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.blogservice.getArticleById(id).subscribe(result => this.entry = result);
      }
    });
  }


}
