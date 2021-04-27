import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class PhotoService {

  public photos: Subject<any> = new Subject();

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) { }

  fetchPhotos() {
    return this.http.get<any>(`${environment.apiUrl}/api/auth/photos`)
      .pipe(
        tap((result) => {
         this.photos.next(result);
        }),
        catchError (err => {
          this.logger.error(err);
          return throwError(err);
        })
      );
  }



}
