import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  private router = inject(Router);

  logout(): void {
    console.log("Hi");
    
    localStorage.removeItem('jwt');
    this.router.navigate(['login']);
  }
}
