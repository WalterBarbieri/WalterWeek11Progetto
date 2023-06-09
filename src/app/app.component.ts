import { Component } from '@angular/core';
import { AuthData } from './auth/auth.interface';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WalterWeek11Progetto';

  user!: AuthData | null;

  constructor(private router: Router, private authService: AuthService) {
    this.user = null;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

