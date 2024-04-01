import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorState } from 'src/app/enums/editor-state';
import { BlogService } from 'src/app/services/blog.service';
import { ImageService } from 'src/app/services/image.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ArticleModel } from 'src/app/classes/article-model';

@Component({
  selector: 'app-blog-form',
  host: {
    class: 'h-full'
  },
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {

  entry: ArticleModel = {id: 0, lastChanged: "", createdAt: "", markdownText: "", tags: [], title: "", userName: ""};
  editorState: EditorState = EditorState.Both;

  editorStateEnum = EditorState;
  imageApiUrl: string = environment.IMAGE_API;


  constructor(private blogservice: BlogService, private route: ActivatedRoute, private location: Location, private imageService: ImageService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let entryId = params['id'];
      if (entryId !== '_') {
        this.blogservice.getArticleById(entryId).subscribe(result => this.entry = result);
      }
    });
  }

  removeTag(index: number): void {
    this.entry?.tags.splice(index, 1);
  }

  addTag(): void {
    this.entry?.tags.push('');
  }

  save(): void {
    if (this.entry?.id === 0) {
      this.blogservice.addEntry(this.entry).subscribe(res => {
        this.toastr.success('Entry Saved', '');
        this.router.navigate([`entryForm/${res.id}`]);
      });
    } else {
      this.blogservice.editEntry(this.entry).subscribe(res => {
        this.toastr.success('Entry Saved', '');
      });
    }
  }

  back(): void {
    this.location.back();
  }

  trackByFn(index: number, item: string): number {
    return index;
  }

  changeEditMode(state: EditorState): void {
    this.editorState = state;
  }

  setTextForImage(value: string): void {
    let cursorPosition = this.getCursorPosition();

    if (cursorPosition < 0) { cursorPosition = 0 }
    if (cursorPosition > this.entry?.markdownText.length) { cursorPosition = this.entry.markdownText.length; }

    const part1 = this.entry.markdownText.slice(0, cursorPosition);
    const part2 = this.entry.markdownText.slice(cursorPosition);

    this.entry.markdownText =  part1 + value + part2;
  }

  getCursorPosition(): number {
    const el = document.activeElement as HTMLTextAreaElement;
    if (el) {
      return el.selectionStart;
    }
    return -1;
  }

  onPaste(e: any) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let blob = null;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();

        this.imageService.saveImage(blob).subscribe(res => {
          const imgstring = `\n![](${this.imageApiUrl}/${res.imageUrl})`;
          this.setTextForImage(imgstring)
        });
      }
    }
  }
}
