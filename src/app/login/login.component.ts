import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/msgraph';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const token = this.authService.getAuthToken();
    if (token != null) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    this.authService.login();
  }
}
