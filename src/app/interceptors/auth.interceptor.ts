import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { loggers } from "winston";
import { AuthService } from "../services/authservice";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      setHeaders: { "Authorization": "Bearer " + authToken }
    });

    return next.handle(authRequest).pipe(tap(event => {

    }));
  }
}
