import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Eterios.be Portal';

  constructor (
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }

}
