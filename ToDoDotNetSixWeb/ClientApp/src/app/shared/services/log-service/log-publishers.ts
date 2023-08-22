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

import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, first } from 'rxjs/operators';
import { LogEntry } from './log.service';
import { isNullOrUndefined } from 'is-what';
import { AppConfig, AppConfigService } from '../app-config.service';

export interface ILogEntry {
  logId: number,
  message: string,
  extraInfo: any[]
}

/**
 * Log Publisher Abstract Class.
 *
 * NOTE: This class must be located BEFORE all those that extend this class.
 */
export abstract class LogPublisher {

  location: string = "";

  abstract log(record: LogEntry): Observable<boolean>
  abstract clear(): Observable<boolean>;
}

/**
 * Console Logging Class.
 */
export class LogConsole extends LogPublisher {

  /**
   * Log.
   * @param entry Entry
   */
  log(entry: LogEntry): Observable<boolean> {
    // Log to console
    console.log(entry.buildLogString());

    return of(true);
  }

  /**
   * Clear.
   */
  clear(): Observable<boolean> {
    console.clear();
    
    return of(true);
  }
}

/**
 * Local Storage Logging Class.
 */
export class LogLocalStorage extends LogPublisher {

  constructor() {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = 'logging';
  }

  /**
   * Append log entry to local storage.
   * @param entry
   */
  log(entry: LogEntry): Observable<boolean> {
    let returnValue: boolean = false;
    let values: LogEntry[];

    try {
      // Retrieve previous values from local storage
      values = JSON.parse(localStorage?.getItem(this.location) ?? "") || [];
      // Add new log entry to array
      values.push(entry);
      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));

      // Set return value
      returnValue = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }

    return of(returnValue);
  }

  /**
   * Clear all log entries from local storage.
   */
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

/**
 * Logging Web API Class.
 */
export class LogWebApi extends LogPublisher {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    // Must call super() from derived classes
    super();
    this.onInit();
  }

  async onInit() {
    let config: AppConfig = { "WebApi": "" };

    // get config
    await this.appConfig.AppConfig.pipe(first()).toPromise().then(cfg => config = cfg as AppConfig);

    this.location = `${config.WebApi}/api/Log`;
  }

  // Public Methods

  /**
   * Add log entry to back end data store.
   * @param entry Entry
   */
  log(entry: LogEntry): Observable<boolean> {

    let logEntry: ILogEntry;
    let logId: number = -1;
    if (entry.extraInfo.length > 0) {
      if (Number.isInteger(entry.extraInfo[0]))
        logId = entry.extraInfo[0];
    }
    logEntry = {
      "logId": logId, "message": entry.message, "extraInfo": entry.extraInfo
    };

    return this.http.post(this.location, logEntry).pipe(
      map(response => response as boolean),
      catchError(this.handleErrors)
    );
  }

  /**
   * Clear.
   *
   * Required for compliance with LogPublisher abstract class but not used.
   */
  clear(): Observable<boolean> {
    return of(true);
  }

  // Private Methods

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
