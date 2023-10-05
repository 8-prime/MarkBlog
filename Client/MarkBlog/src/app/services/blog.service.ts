import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BlogEntry } from '../classes/blog-entry';

@Injectable({
  providedIn: 'root'
})
export class BlogService {


  baseUrl: string = environment.API_URL;

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
    return this.http.post<BlogEntry[]>(`${this.baseUrl}/add`, entry);    
  }

  editEntry(entry: BlogEntry){
    return this.http.put<BlogEntry[]>(`${this.baseUrl}/add`, entry);    
  }
}
