/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Interceptors
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Authentication Interceptor Service
*  Notes:
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  10 AUG 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, first, Observable, switchMap, take, throwError } from 'rxjs';
import { AppConfigService } from '../services/app-config.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationInterceptorService {

  private jwtHelperService: JwtHelperService;
  private apiBaseUrl: string = "";

  constructor(
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService
  ) {

    this.jwtHelperService = new JwtHelperService();

    this.appConfigService.AppConfig.pipe(take(1)).subscribe(config => this.apiBaseUrl = config?.WebApi ?? "");
  }

  /**
   * Add Authentication Token
   * @param request
   * @returns
   */
  addAuthenticationToken(request: HttpRequest<any>) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authenticationService.getToken()}`
      }
    });
    return request;
  }

  /**
   * Intercept
   * @param request
   * @param next
   * @param retry
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  intercept(request: HttpRequest<any>, next: HttpHandler, retry: number = 0): Observable<HttpEvent<any>> {

    // add auth header with jwt if user is logged in and request is to api url

    const tokenRequired = !(request.url.toLowerCase().includes("/api/account/refreshtoken") || request.url.toLowerCase().includes("/api/account/createtoken") || request.url.toLowerCase().includes("api/config"));
    const token = this.authenticationService.getToken();
    const tokenValid = token && !this.jwtHelperService.isTokenExpired(token);

    const isApiUrl = request.url.startsWith(this.apiBaseUrl) || request.url.startsWith("/api/");
    if (tokenValid && tokenRequired && isApiUrl) {
      return next.handle(this.addAuthenticationToken(request)).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.authenticationService.refreshToken().subscribe(() => { });
          }
          return throwError(error);
        }));

    } else if (isApiUrl && tokenRequired && token && !tokenValid) {
      return this.authenticationService.refreshToken().pipe(first(),
        switchMap(() => {
          return next.handle(this.addAuthenticationToken(request));
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.authenticationService.refreshToken().subscribe(() => { });
          }
          return throwError(error);
        }));
    } else {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (token)
              this.authenticationService.refreshToken().subscribe(() => { });
            else
              this.authenticationService.newAuthenticationEvent(false);
          }
          return throwError(error);
        }));
    }

  }
}
