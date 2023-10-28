import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlogEntry } from '../classes/blog-entry';

@Injectable({
  providedIn: 'root'
})
export class BlogService {


  baseUrl: string = environment.BLOG_API;

  constructor(private http: HttpClient) { }


  getAllEntries(): Observable<BlogEntry[]>{
    return this.http.get<BlogEntry[]>(`${this.baseUrl}/`);
  }

  getEntryById(id: string): Observable<BlogEntry>{
    return this.http.get<BlogEntry>(`${this.baseUrl}/byId/${id}`);
  }

  getAllEntriesForSearch(search: string): Observable<BlogEntry[]>{
    return this.http.get<BlogEntry[]>(`${this.baseUrl}/find/${search}`);
  }

  addEntry(entry: BlogEntry){
    return this.http.post<any>(`${this.baseUrl}/add`, entry);    
  }

  editEntry(entry: BlogEntry){
    return this.http.put(`${this.baseUrl}/edit`, entry);    
  }

  removeEnrty(entryId: string){
    return this.http.delete(`${this.baseUrl}/remove/${entryId}`);    
  }
}
