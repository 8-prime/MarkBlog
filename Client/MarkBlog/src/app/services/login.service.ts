import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl: string = environment.LOGIN_API;
  user$: Observable<string> = of("");

  private http = inject(HttpClient)

  login(user: string, password: string): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`, {user, password});
  }

  register(user: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, {user, password})
  }
}
