/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      02 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Log Service
*  Notes:     from this original source:
*   https://www.codemag.com/Article/1711021/Logging-in-Angular-Applications
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  02 AUG 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi } from './log-publishers';
import { AppConfig, AppConfigService } from '../app-config.service';
import { isNullOrUndefined } from 'is-what';
//import { Log } from 'oidc-client';

/**
 * Log Publisher Config Definition Class.
 */
class LogPublisherConfig {
  loggerName?: string;
  loggerLocation?: string;
  isActive?: boolean;

  constructor(logPublisherParams: string[]) {
    if (logPublisherParams.length == 3) {
      this.loggerName = logPublisherParams[0];
      this.loggerLocation = logPublisherParams[1];
      this.isActive = (/true/i).test(logPublisherParams[2].toLowerCase());
    }
  }
}

@Injectable(
  { providedIn: 'root' }
)
export class LogPublishersService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.OnInit();
  }

  async OnInit() {
    await this.convertConfigToLogPublisherConfigs();
    this.buildPublishers();
  }

  // Public properties
  publishers: LogPublisher[] = [];
  logPublisherConfigs: LogPublisherConfig[] = [];

  /**
   * Convert Config to Log Publisher Configs.
   */
  async convertConfigToLogPublisherConfigs() {

    let logPublisherConfigStrings: string[] = [];    
    let config: AppConfig;

    // get config
    await this.appConfig.AppConfig.pipe(first()).toPromise().then(cfg => config = cfg as AppConfig);

    // convert config log publishers settings into an array of strings
    for (let i: number = 1; i < 10; i++) {
      let evalConfigString: string = `config.logPublishers${i}`;
      let configString: string = eval(evalConfigString);
      if (!isNullOrUndefined(configString))
        logPublisherConfigStrings.push(configString);
    }

    // convert log publishers array of strings into an array of log publisher configs
    for (let logPublisherConfigString of logPublisherConfigStrings) {
      let logPublisherParams = logPublisherConfigString.split(',');
      if (logPublisherParams.length == 3) {
        this.logPublisherConfigs.push(new LogPublisherConfig(logPublisherParams));
      }
    }

  } 

  /**
   * Build publishers array.
   */
  buildPublishers(): void {
    let logPublisher: LogPublisher = new LogConsole();
    let _publishers: LogPublisherConfig[];

    for (let logPublisherConfig of this.logPublisherConfigs.filter(cfg => cfg.isActive)) {
      switch (logPublisherConfig?.loggerName?.toLowerCase() ?? "") {
        case 'console':
          break;
        case 'localstorage':
          logPublisher = new LogLocalStorage();
          break;
        case 'webapi':
          logPublisher = new LogWebApi(this.http, this.appConfig);
          break;
      }
      // Set location of logging
      logPublisher.location = logPublisherConfig?.loggerLocation ?? "";
      // Add publisher to array
      this.publishers.push(logPublisher);
    }
  }

  // Private methods

  /**
   * Handle Errors.
   * @param error Error
   */
  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = '';

    msg = 'Status: ' + error.status;
    msg += ' - Status Text: ' + error.statusText;
    if (!isNullOrUndefined(error.message)) {
      msg += ' - Exception Message: ' + error.message;
    }
    errors.push(msg);

    console.error('An error occurred', errors);

    return throwError(errors);
  }
}
