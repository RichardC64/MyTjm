import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { AuthService } from '@services/msgraph';
import { UserService } from '@services/msgraph/user';

@Component({
  selector: 'app-ms-connect',
  templateUrl: './ms-connect.component.html'
})
export class MsConnectComponent implements OnInit {
  me: MicrosoftGraph.User = null;
  isWorking = false;
  isConnected = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  private refresh() {
    this.isWorking = true;
    this.userService.getMe().subscribe(me => {
      this.isWorking = false;
      this.me = me;
      this.isConnected = me != null;

      if (this.me == null) {
        this.onLogout();
      }
    }, error => {
      this.onLogout();
    });
  }

  onLogout() {
    this.me = null;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
