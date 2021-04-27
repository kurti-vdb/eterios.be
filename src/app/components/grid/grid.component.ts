import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authservice';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  @Input() photos?: Observable<any[]>;

  constructor(private authService: AuthService, private uploadService: UploadService) { }

  ngOnInit(): void {

  }

  downloadImage(organisation: string, filename: string){
    window.open("https://eterios.ams3.digitaloceanspaces.com/" + organisation + "/750/" + filename, "_blank");
  }

  ngOnDestroy(): void {

  }
}
