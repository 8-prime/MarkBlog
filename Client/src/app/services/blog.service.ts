import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticleShell } from '../classes/article-shell';
import { ArticleModel } from '../classes/article-model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {


  baseUrl: string = environment.BLOG_API;

  constructor(private http: HttpClient) { }


  getAllArticles(): Observable<ArticleShell[]>{
    return this.http.get<ArticleShell[]>(`${this.baseUrl}/shells`)
  }

  getAllArticlesForUser(id: number): Observable<ArticleShell[]>{
    return this.http.get<ArticleShell[]>(`${this.baseUrl}/shells/${id}`)
  }

  getArticleById(id: string): Observable<ArticleModel>{
    return this.http.get<ArticleModel>(`${this.baseUrl}/${id}`);
  }

  getAllEntriesForSearch(search: string): Observable<ArticleShell[]>{
    const options = search ? { params: new HttpParams().set('searchTerm', search)} : {};
    return this.http.get<ArticleShell[]>(`${this.baseUrl}/shells`, options);
  }

  addEntry(entry: ArticleModel): Observable<ArticleModel>{
    return this.http.post<ArticleModel>(`${this.baseUrl}/create`, entry);    
  }

  editEntry(entry: ArticleModel): Observable<ArticleModel>{
    return this.http.put<ArticleModel>(`${this.baseUrl}/update`, entry);    
  }

  removeEntry(entryId: number){
    return this.http.delete(`${this.baseUrl}/delete/${entryId}`);    
  }
}
