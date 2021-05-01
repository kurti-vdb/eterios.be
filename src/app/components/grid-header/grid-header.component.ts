import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-header',
  templateUrl: './grid-header.component.html',
  styleUrls: ['./grid-header.component.css']
})
export class GridHeaderComponent implements OnInit {

  subscription: Subscription | undefined;
  totalOfPhotos!: number;
  @Input()photos: Observable<any[]> = new Observable();


  constructor() { }

  ngOnInit(): void {
    this.subscription = this.photos?.subscribe(response => {
      this.totalOfPhotos = response.length;
      console.log(response.length);
    })

  }

}
