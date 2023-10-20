import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogEntry } from 'src/app/classes/blog-entry';
import { EditorState } from 'src/app/enums/editor-state';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-form',
  host: {
    class:'h-full'
  },
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {

  entry: BlogEntry = new BlogEntry();  
  editorState: EditorState = EditorState.Both;

  editorStateEnum = EditorState;


  constructor(private blogservice: BlogService, private route: ActivatedRoute, private location: Location){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let entryId = params['id'];
      if(entryId !== '_'){
        this.blogservice.getEntryById(entryId).subscribe(result => this.entry = result);
      }
    });
  }

  removeTag(index: number): void {
    this.entry.tags.splice(index, 1);
  }

  addTag(): void{
    console.log("New Entry in theory");
    
    this.entry.tags.push('');
  }

  save(): void {
    if(this.entry._id === ''){
      this.blogservice.addEntry(this.entry).subscribe();
    }else {
      this.blogservice.editEntry(this.entry).subscribe();
    }
  }

  back(): void {
    this.location.back();
  }

  trackByFn(index: number, item: string): number{
    return index;
  }

  changeEditMode(state : EditorState) : void {
    this.editorState = state;
  }
}
