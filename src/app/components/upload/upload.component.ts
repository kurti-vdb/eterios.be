import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import exifr from 'exifr';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {

  selectedFiles!: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  googleMarkers: any[] = [];
  files: any[] = [];

  fileInfos?: Observable<any[]>;
  selectedFilesSubscription!: Subscription;

  constructor(private uploadService: UploadService, private logger: NGXLogger) { }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.logger.info(this.selectedFiles);
    this.uploadService.setSelectedFiles(this.selectedFiles);
    this.files = [];
    [...event.target.files].forEach(file => {
      let x = { name: file.name, size: this.formatBytes(file.size) }
      this.files.push(x);
    });
  }

  uploadFiles(): void {
    this.message = [];
    this.googleMarkers = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {
      this.uploadService.upload(file).subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          }
          else if (event instanceof HttpResponse) {
            this.getExif(file);
            this.logger.info(JSON.stringify(event));
            this.message.push(event.body.message);
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
          this.fileInfos = this.uploadService.getFiles();
        });
    }
  }




  ngOnDestroy(): void {
    this.selectedFilesSubscription.unsubscribe();
  }

  getExif(file: any) {
    exifr.parse(file).then( result => {
      console.log(result);
    })
  }


  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


}



