import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
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
  private toastr = inject(ToastrService);
  private router = inject(Router)
  private location = inject(Location)

  login(): void {
    console.log("logging in");
    
    this.loginServe.login(this.username, this.password).pipe(
      tap(() => console.log( document.cookie))      
    ).subscribe( (value) => {
      localStorage.setItem('jwt', value['jwt'])
      this.toastr.success('Logged in', '');
      this.location.back();
    });
  }

  register(): void {
    this.loginServe.register(this.username, this.password).pipe(
      tap(() => console.log("Hi")),
      tap(() => console.log(document.cookie))      
    ).subscribe( (value) => {
      localStorage.setItem('jwt', value['jwt'])
      this.toastr.success('Registered', '');
      this.location.back();
    });
  }
}
