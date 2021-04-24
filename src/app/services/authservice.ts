import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { NGXLogger } from "ngx-logger";
//import { User } from "../models/user.model";
import { environment } from "../../environments/environment"
import { catchError, map, tap } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { User } from "../models/user";

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit {

  private token!: string | null;
  private isAuthenticated = false;
  private tokenTimer!: NodeJS.Timer;
  private authStatusSubject = new Subject<boolean>();
  public user!: User;
  private userUpdated = new Subject<User>();

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  constructor(
    private logger: NGXLogger,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

  }

  login(username: string, password: string) {
    return this.http.post<any>(environment.apiUrl + '/api/auth/login', { username, password })
      .pipe(
        catchError (err => {
          this.logger.error(err);
          return throwError(err);
        }),
        tap(response => {
          this.logger.info(response);
          this.processLoginResponse(response);
      }));
  }

  create(username: string, password: string) {
    return this.http.post<any>(environment.apiUrl + '/api/auth/create', { username, password })
      .pipe(
        catchError (err => {
          this.logger.error(err);
          return throwError(err);
        }),
        tap(response => {
          //this.processLoginResponse(response);
      }));
  }

  logout() {
    this.token = null;
    //this.user = new User(); // TODO - Check if thsi still works instead of asigning this to null
    this.isAuthenticated = false;
    this.authStatusSubject.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  autoLogin() {
    const authInfo = this.getAuthData();

    if(!authInfo) { return; }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatusSubject.next(true);
      this.setAuthTimer(expiresIn / 1000);
      this.user = authInfo.user;
      this.userUpdated.next({...this.user});
    }
  }

  private processLoginResponse(response: any) {

    if (!response.token) { return; }

    this.token = response.token;
    if(response.token) {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.user = response.user;
      this.userUpdated.next({...this.user});
      this.isAuthenticated = true;
      this.authStatusSubject.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(response.token, expirationDate, this.user);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, user: User) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private getAuthData() {
    const token = localStorage.getItem('jwt');
    const expirationDate = localStorage.getItem('expiration');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
