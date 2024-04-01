import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Loginstate } from 'src/app/enums/loginstate';
import { AuthGuardService } from 'src/app/routeguards/auth-guard-service';
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
  private authGuard = inject(AuthGuardService)
  private location = inject(Location)

  login(): void {
    this.loginServe.login(this.username, this.password).subscribe((value) => {
        this.toastr.success('Logged in', '');
        this.navigate();
    });
  }

  register(): void {
    this.loginServe.register(this.username, this.password)
    .subscribe( (value) => {
      this.toastr.success('Registered', '');
      this.navigate();
    });
  }

  navigate(): void {
    const dest = this.authGuard.originalUrl;
    if(dest){
      this.authGuard.originalUrl = '';
      this.router.navigateByUrl(dest);
    }
    else{
      this.location.back();
    }
  }
}
