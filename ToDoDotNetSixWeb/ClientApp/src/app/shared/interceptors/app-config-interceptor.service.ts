/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Interceptors
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  App Config Interceptor Service
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { switchMap, first, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConfig, AppConfigService } from '../services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfigInterceptorService {

  private config: AppConfig | undefined;
  private urlExceptions: string[] = ["/api/generatelanguages", "/api/config"];

  constructor(private appConfigService: AppConfigService) {
    this.appConfigService.AppConfig.pipe(take(1)).subscribe((config: AppConfig) => {
      this.config = config;
    });
  }

  /**
   * intercept
   * @param request
   * @param next
   * @param retry
   * @returns
   */
  intercept(request: HttpRequest<any>, next: HttpHandler, retry: number = 0): Observable<HttpEvent<any>> {
    if (request.url.startsWith("/api/") && !this.urlExceptions.includes(request.url.toLowerCase())) {
      if (this.config) {
        return next.handle(request.clone({ url: this.config.WebApi + request.url }));
      } else {
        return this.appConfigService.AppConfig.pipe(first(), switchMap((config) => {
          return next.handle(request.clone({ url: config.WebApi + request.url }));
        }));
      }
    } else {
      return next.handle(request);
    }
  }
}
