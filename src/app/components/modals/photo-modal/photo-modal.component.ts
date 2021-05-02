import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css']
})
export class PhotoModalComponent implements OnInit, AfterViewInit {

  @Input() marker: any;
  @ViewChild('modal') modal!:ElementRef;


  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  openModal() {
    this.modal.nativeElement.style.display = "block";
  }

  closeModal() {
    this.modal.nativeElement.style.display = "none";
  }

}
