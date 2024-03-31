import { Component, inject } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showUserSettings = false;

  userNameStart = "";
  authService = inject(LoginService);

  constructor() {
    this.authService.loggedInUserSubject.subscribe(d => {
      if(d){
        console.log(d);        
        this.userNameStart = d.slice(0,1)
      }
      else{
        this.userNameStart = "";
      }
    })
  }
}
