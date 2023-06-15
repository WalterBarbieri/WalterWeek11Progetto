import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error!: string;

  showAlert = true;

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  accedi(form: NgForm) {
    console.log(form.value);

    this.authSrv.login(form.value).pipe(
      catchError(error => {
        console.error(error);
        this.error = error;
        form.reset();
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        sessionStorage.setItem('isFirstLoad', 'true')
        this.router.navigate(['/']);
      }
    });
  }
  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  chiudiAlert(){
    this.showAlert = false;
    this.error = '';
    this.showAlert = true;
  }

}
