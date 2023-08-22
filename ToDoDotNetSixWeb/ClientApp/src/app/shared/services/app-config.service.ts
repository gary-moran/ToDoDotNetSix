/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  App Config Service
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { shareReplay, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

export declare type AppConfig = { [key: string]: any };

export class AppConfigHelper {
  private _config: AppConfig;

  public constructor(config?: AppConfig) {
    if (config) {
      this._config = config;
    } else {
      this._config = {};
    }
  }

  public cloneAppConfig(): AppConfig {
    const tmpConfig: AppConfig = {};
    Object.keys(this._config).forEach((key) => {
      tmpConfig[key] = this._config[key];
    });
    return tmpConfig;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private baseUrl: string;
  private config: AppConfigHelper | undefined;
  private configSubject: Subject<AppConfig> = new Subject<AppConfig>();
  public AppConfig: Observable<AppConfig> = this.configSubject.pipe(shareReplay(1));

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) { this.baseUrl = baseUrl; }

  public load() {
    return new Promise((resolve, reject) => {
      const webApi: string = `${this.baseUrl}api/config`;

      if (!this.config) {
        this.httpClient.get<AppConfig>(webApi).pipe(take(1)).subscribe(config => {
            this.config = new AppConfigHelper(config);
            this.configSubject.next(this.config.cloneAppConfig());
            resolve(true);
          },
            (error) => {
              reject(error);
            }
          );
      } else {
        resolve(true);
      }

    });
  }

}
