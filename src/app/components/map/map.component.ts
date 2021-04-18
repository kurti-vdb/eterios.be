import { Component, Input, OnInit } from '@angular/core';
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
  googleMarkers: any[] = [];
  googleMarkersSubscription!: Subscription;
  @Input() fileInfos?: Observable<any[]>;

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    this.uploadService.getSelectedFilesSubject().subscribe(response => {
      this.selectedFiles = response;
      console.log(response);
    });

    this.uploadService.getGoogleMarkersSubject().subscribe(response => {
      this.googleMarkers = response;
      console.log("markers response: " + JSON.stringify(response));
    })
  }


  getGoogleMarkers = () => {

  }

  ngOnDestroy(): void {
    this.googleMarkersSubscription.unsubscribe();
  }

}
