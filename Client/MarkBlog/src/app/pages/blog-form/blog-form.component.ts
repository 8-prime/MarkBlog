import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogEntry } from 'src/app/classes/blog-entry';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {

  entry: BlogEntry = new BlogEntry();  

  constructor(private blogservice: BlogService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let entryId = params['id'];
      if(entryId !== '_'){
        this.blogservice.getEntryById(entryId).subscribe(result => this.entry = result);
      }
    });
  }
}
