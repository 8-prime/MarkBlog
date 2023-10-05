import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogEntry } from 'src/app/classes/blog-entry';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent {
  entries: BlogEntry = new BlogEntry();

  constructor(private blogservice: BlogService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.blogservice.getEntryById(id).subscribe(result => this.entries = result);
      }
    });
  }


}
