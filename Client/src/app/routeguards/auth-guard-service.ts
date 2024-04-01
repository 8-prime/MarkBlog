import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Injectable()
export class AuthGuardService {

  originalUrl: string = '';

  constructor(public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!localStorage.getItem('jwt') || !this.jwtIsValid(localStorage.getItem('jwt')!)) {
      console.log("not logged in :/");
      console.log(localStorage.getItem('jwt'));
      
      
      this.originalUrl = state.url;
      this.router.navigate(['login']);
      return false;
    }
    console.log("logged in :D");
    
    return true;
  }


  jwtIsValid(jwt: string): boolean {
    const decoded = jwtDecode(jwt ?? "");
    return new Date(decoded.exp!).valueOf() < Date.now().valueOf() ;
  }
}