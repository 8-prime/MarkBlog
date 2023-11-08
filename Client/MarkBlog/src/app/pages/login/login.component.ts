import { Component, inject } from '@angular/core';
import { Loginstate } from 'src/app/enums/loginstate';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  host: {
    class: 'h-full'
  },
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginState: Loginstate = Loginstate.login;
  loginStateEnum = Loginstate;

  username: string = "";
  password: string = "";

  private loginServe = inject(LoginService);


  login(): void {
    console.log("logging in");
    
    this.loginServe.login(this.username, this.password).subscribe();
  }

  register(): void {
    this.loginServe.register(this.username, this.password).subscribe();
  }
}
