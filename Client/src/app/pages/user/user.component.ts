import { Component, inject } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  private loginService = inject(LoginService);

  isLoggedIn = false;

  constructor(){
    this.loginService.loggedInUserSubject.subscribe(d => {
      if(d){
        this.isLoggedIn = true
      }
      else{
        this.isLoggedIn = false
      }
    })
  } 

  logout(): void {
    this.loginService.logout();
  }
}
