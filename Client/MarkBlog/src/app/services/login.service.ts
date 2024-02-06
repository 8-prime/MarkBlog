import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthToken } from '../classes/auth-token';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl: string = environment.LOGIN_API;

  private http = inject(HttpClient)

  login(user: string, password: string) : Observable<AuthToken>{
    return this.http.post<AuthToken>(`${this.baseUrl}/login`, {userName: user,password: password}).pipe(
      tap((data) => {
        localStorage.setItem('jwt', data.jwt);
        console.log("set jwt");
        console.log(data.jwt);
        
        
    }));
  }

  register(user: string, password: string) : Observable<AuthToken>{
    return this.http.post<AuthToken>(`${this.baseUrl}/register`, {user, password}).pipe(
      tap((data) => {
        localStorage.setItem('jwt', data.jwt);
    }));
  }

  getUserId(){
    const token = localStorage.getItem('jwt');
    const decoded = jwtDecode(token ?? "") as any;
    console.log(decoded);
    return decoded.id;
  }
}
