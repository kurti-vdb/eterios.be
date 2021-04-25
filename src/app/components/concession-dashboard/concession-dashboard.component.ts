import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authservice';

@Component({
  selector: 'app-concession-dashboard',
  templateUrl: './concession-dashboard.component.html',
  styleUrls: ['./concession-dashboard.component.css']
})
export class ConcessionDashboardComponent implements OnInit {

  public organisation?: string;
  public user?: string;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.organisation = this.authService.user.organisation;
    this.user = this.authService.user.username;
  }

}
