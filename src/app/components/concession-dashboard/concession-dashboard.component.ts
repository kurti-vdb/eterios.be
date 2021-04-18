import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authservice';

@Component({
  selector: 'app-concession-dashboard',
  templateUrl: './concession-dashboard.component.html',
  styleUrls: ['./concession-dashboard.component.css']
})
export class ConcessionDashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    //this.fileInfos = this.uploadService.getFiles();
  }

}
