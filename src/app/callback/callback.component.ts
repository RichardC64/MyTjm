import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/msgraph';

@Component({
  selector: 'app-callback',
  template: ''
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.onCallback();
  }
}
