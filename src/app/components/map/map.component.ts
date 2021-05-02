import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat: number = 51.039662498089136;
  lng: number = 4.489006697632691;

  selectedFiles!: FileList;

  @ViewChild('modal') modal!:ElementRef;
  @Input() googleMarkers: any[] = [];
  googleMarkersSubscription!: Subscription;

  @Input() photos: any[] = [];
  @Input() fileInfos?: Observable<any[]>;

  styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]


  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {

  }

  showDetails(marker: any) {
    console.log("Marker clicked:" + JSON.stringify(marker))
  }

  openModal() {
    this.modal.nativeElement.style.display = "block";
  }

  ngOnDestroy(): void {

  }

}
