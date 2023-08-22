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
import { LogPublishersService } from './log-publishers.service';
import { LogPublisher } from './log-publishers';
import { take } from 'rxjs';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

/**
 * Log Entry Class.
 */
export class LogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message: string = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate: boolean = true;

  /**
   * Build Log string.
   */
  buildLogString(): string {
    let value: string = '';

    if (this.logWithDate) {
      value = new Date() + ' - ';
    }
    value += 'Type: ' + LogLevel[this.level];
    value += ' - Message: ' + this.message;
    if (this.extraInfo.length) {
      value += ' - Extra Info: '
        + this.formatParams(this.extraInfo);
    }

    return value;
  }

  /**
   * Format Log Entry Params.
   * @param params Params
   */
  private formatParams(params: any[]): string {
    let returnValue: string = params.join(',');

    // Is there at least one object in the array?
    if (params.some(p => typeof p == 'object')) {
      returnValue = '';
      // Build comma-delimited string
      for (let item of params) {
        returnValue += JSON.stringify(item) + ',';
      }
    }

    return returnValue;
  }
}

@Injectable(
  { providedIn: 'root' }
)
export class LogService {
  constructor(private publishersService: LogPublishersService) {
    // Set publishers
    this.publishers = this.publishersService.publishers;
  }

  // Public Properties
  publishers: LogPublisher[];
  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  /**
   * Debug.
   * @param msg Message
   * @param optionalParams Optional Params
   */
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  /**
   * Info.
   * @param msg Message
   * @param optionalParams Optional Params
   */
  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  /**
   * Warn.
   * @param msg Message
   * @param optionalParams Optional Params
   */
  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  /**
   * Error.
   * @param msg Message
   * @param optionalParams Optional Params
   */
  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  /**
   * Fatal.
   * @param msg Message
   * @param optionalParams Optional Params
   */
  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  /**
   * Log.
   * @param msg Message
   * @param optionalParams Optional Params
   */
  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  /**
   * Clear.
   */
  clear(): void {
    for (let logger of this.publishers) {
      logger.clear()
        .pipe(take(1)).subscribe(response => { /* console.log(response) */ });
    }
  }

  // Private methods

  /**
   * Should log.
   * @param level Log Level
   */
  private shouldLog(level: LogLevel): boolean {
    let returnValue: boolean = false;

    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      returnValue = true;
    }

    return returnValue;
  }

  /**
   * Write to log.
   * @param msg Message
   * @param level Level
   * @param params Params
   */
  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      // Declare variables
      let entry: LogEntry = new LogEntry();

      // Build Log Entry
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logger of this.publishers) {
        logger.log(entry)
          .subscribe(response => { /* console.log(response) */ });
      }
    }
  }
}
