import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/authservice';
import { UploadService } from 'src/app/services/upload.service';
import exifr from 'exifr';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-concession-dashboard',
  templateUrl: './concession-dashboard.component.html',
  styleUrls: ['./concession-dashboard.component.css']
})
export class ConcessionDashboardComponent implements OnInit {

  public organisation?: string;
  public user?: string;
  page: number = 1;

  photos: Observable<any[]> = new Observable();
  fileInfos?: Observable<any[]>;

  selectedFiles!: FileList;
  files: any[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  googleMarkers: any[] = [];

  constructor(
    private uploadService: UploadService,
    private logger: NGXLogger,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.organisation = this.authService.user.organisation;
    this.user = this.authService.user.username;
    this.fileInfos = this.uploadService.getFiles();
    this.photos = this.uploadService.getPhotos();
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.logger.info(this.selectedFiles);
    this.uploadService.setSelectedFiles(this.selectedFiles);
  }

  uploadFiles(): void {
    this.message = [];
    this.googleMarkers = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i])
          .then(response => {
            this.googleMarkers = [...this.googleMarkers];
          });
      }
    }
  }

  async upload(idx: number, file: File) {
    this.progressInfos[idx] = { success: false, isUploading: true, value: 0, fileName: file.name, message: "" };

    if (file) {
      exifr.parse(file)
        .then( exif => {

          if(!exif?.latitude && !exif?.longitude) {
            this.progressInfos[idx].message = "Geen lat en lng exif data beschikbaar";
            this.progressInfos[idx].success = false;
            this.progressInfos[idx].isUploading = false;
            return;
          }

          this.uploadService.upload(file, exif).subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
            }
            else if (event instanceof HttpResponse) {
              this.uploadService.uploadExif({ exif: exif, filename: file.name }).subscribe(
                response => {
                  this.progressInfos[idx].message = event.body.message
                  console.log(response.photo);
                  this.googleMarkers = [...this.googleMarkers, response.photo];
                  this.fileInfos = this.uploadService.getFiles();
                  this.photos = this.uploadService.getPhotos();
                  this.progressInfos[idx].success = true;
                  this.progressInfos[idx].isUploading = false;
                },
                error => {
                  this.progressInfos[idx].success = false;
                  this.progressInfos[idx].isUploading = false;
                  this.progressInfos[idx].message = error.error?.message?.sqlMessage;
                }
              );
            }
          },(err) => {
            this.progressInfos[idx].value = 0;
            this.progressInfos[idx].success = false;
            this.progressInfos[idx].isUploading = false;
            this.progressInfos[idx].message = "Er ging iets fout bij de upload, probeer opnieuw";
            this.fileInfos = this.uploadService.getFiles();
          });

        })
    }
  }

  deletePhoto(filename: string) {
    this.uploadService.deletePhoto(filename).subscribe(response => {
      this.photos = this.uploadService.getPhotos();
    })
  }

  addMarker(marker: any) {
    console.log(marker);
    this.googleMarkers = [...this.googleMarkers, marker];
    this.photos = this.uploadService.getPhotos();
  }

  clearMarkers() {
    this.googleMarkers = [];
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  downloadImage(organisation: string, filename: string){
    window.open("https://eterios.ams3.digitaloceanspaces.com/" + organisation + "/750/" + filename);
  }

}
