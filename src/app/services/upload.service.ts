import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  selectedFiles!: FileList;
  private googleMarkers: any[] = [];
  private selectedFilesSubject = new Subject<FileList>();
  private googleMarkersSubject = new Subject<any[]>();

  getSelectedFilesSubject() {
    return this.selectedFilesSubject.asObservable();
  }

  getGoogleMarkersSubject() {
    return this.googleMarkersSubject.asObservable();
  }

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) { }

  upload(file: File, exif: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('exif', exif);
    const req = new HttpRequest('POST', `${environment.apiUrl}/api/auth/upload`, formData, { reportProgress: true, responseType: 'json' });
    return  this.http.request(req);
  }

  uploadExif(uploadData: any) {
    return this.http.post<any>(environment.apiUrl + '/api/auth/uploadexif', uploadData)
    .pipe(
      catchError (err => {
        console.log(err);
        return throwError(err);
      }),
      tap(response => {
        console.log("Upload Exif service response" + response);
      })
    )
  }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/auth/files`)
      .pipe(
        tap(response => {
          this.logger.info(response);
        }),
        catchError (err => {
          this.logger.error(err);
          return throwError(err);
        })
      )
  }

  getSelectedFiles() {
    return this.http.get<any>(environment.apiUrl + '/api/concession/selectedfiles')
      .pipe(
        catchError (err => {
          return throwError(err);
        }),
        tap(response => {
          this.selectedFiles = response;
          this.selectedFilesSubject.next({...this.selectedFiles});
        })
      )
  }

  getGoogleMarkers() {
    return this.http.post<any>(environment.apiUrl + '/api/concession/getgooglemarkers', this.selectedFiles)
      .pipe(
        catchError (err => {
          console.log(err);
          return throwError(err);
        }),
        tap(response => {
          this.googleMarkers = response;
          this.googleMarkersSubject.next([...this.googleMarkers]);
          console.log("Node markers" + response);
        })
      )
  }

  public setSelectedFiles(selectedFiles: any) {
    this.selectedFiles = selectedFiles;
    this.selectedFilesSubject.next({...this.selectedFiles});
    this.getGoogleMarkers();
  }

}
