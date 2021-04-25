import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authservice';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public organisation?: string;
  public user?: string;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.organisation = this.authService.user.organisation;
    this.user = this.authService.user.username;
  }

}
