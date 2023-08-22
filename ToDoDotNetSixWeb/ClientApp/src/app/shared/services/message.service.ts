/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      02 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Message Service
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  02 AUG 2023 GM          Created
************************************************************************/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message';
import { MessageType } from '../models/message-type.enum';
import { LogService } from './log-service/log.service';
import { take } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

export interface INextLogId {
  logId: number
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSubject = new Subject<Message>();
  apiBaseUrl: string = "";

  constructor(private logger: LogService, private appConfigService: AppConfigService, private http: HttpClient) {
    this.onInit();
  }

  async onInit() {    
    await this.appConfigService.AppConfig.pipe(take(1)).subscribe(config => this.apiBaseUrl = `${config?.WebApi ?? ""}/api/Log`);
  }

  /**
   * Send Message
   * @param message
   * @param persist Persist Message
   */
  sendMessage(message: Message, persist: boolean = false): void {
    if (persist)
      message.persist = true;
    this.messageSubject.next(message);
  }

  /**
   * Get Message
   * @returns Observable<Message>
   */
  getMessage(): Observable<Message> {    
    return this.messageSubject.asObservable();
  }

  /**
   * Send Message
   * @param error
   * @param subject
   */
  sendErrorMessage(error: { message: string; }, subject = "nav-menu") {

    let message: string = 'The application has encountered an unexpected error';

    this.http.get(this.apiBaseUrl).pipe(take(1)).subscribe(response => {
      const logId = response as number;
      this.logger.error(error.message, logId);
      message = `${message}. The Log ID for the error is: ${logId}.`;
      this.messageSubject.next(new Message(subject, message, MessageType.Danger));
    }, responseError => this.logger.error(responseError.message));
  }
}
