import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthToken } from '../classes/auth-token';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl: string = environment.LOGIN_API;

  loggedInUserSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private http = inject(HttpClient)
  private router = inject(Router);


  constructor() {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    if (this.TokenIsExpired(token)) {
      localStorage.removeItem('jwt');
      return;
    }

    this.setLoggedInUser(token);
  }

  login(user: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.baseUrl}/login`, { userName: user, password: password }).pipe(
      tap((data) => {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('refresh', data.refresh)
        this.setLoggedInUser(data.jwt);
      }));
  }

  logout() {
    localStorage.removeItem('jwt');
    this.loggedInUserSubject.next(null);
    this.router.navigate(['login']);
  }

  register(user: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.baseUrl}/register`, { userName: user, password: password }).pipe(
      tap((data) => {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('refresh', data.refresh)
      }));
  }

  refresh() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;
    if (this.TokenIsExpired(refresh)) return;

    return this.http.post<AuthToken>(`${this.baseUrl}/refresh`, { 'jwt': '', 'refresh': refresh }).pipe(
      tap(data => {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('refresh', data.refresh)
      }));
  }

  getUserId() {
    const token = localStorage.getItem('jwt');
    const decoded = jwtDecode(token ?? "") as any;
    return decoded.id;
  }

  setLoggedInUser(token: string) {
    const decoded = jwtDecode(token) as any;
    this.loggedInUserSubject.next(decoded.userName)
  }

  TokenIsExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);

    if (Date.now() >= decodedToken.exp * 1000) {
      return false;
    }
    return true;
  }
}
