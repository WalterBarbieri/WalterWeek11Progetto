import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { AuthData } from 'src/app/auth/auth.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user!: AuthData | null;

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    });
  }
  logOut() {
    this.authSrv.logOut();
    this.router.navigate(['/login']);
  }
}
