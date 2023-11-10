import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthGuardService  {
  constructor(public router: Router) {}
  canActivate(): boolean {
    if (!localStorage.getItem('jwt')) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}