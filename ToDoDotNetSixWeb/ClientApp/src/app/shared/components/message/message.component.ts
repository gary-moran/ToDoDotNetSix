/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Components
*  Date:      02 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Message
*  Notes:
*
*  To use, inject the MessageService into your component, then use
*  the service to send a message, passing the subject (which targets the component),
*  message text and message type e.g.
*
*  constructor( private messageService: MessageService ) { }
*
*  this.messageService.sendMessage(new Message("nav-menu", "Successfully deleted todo", MessageType.Success));
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  02 AUG 2023 GM          Created
************************************************************************/

import { Component, Input, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { MessageType } from '../../models/message-type.enum';

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() subject: string = '';
  @Input() disposeInterval: number = 3000;
  @Input()
    persistMessageTypesParam!: string[];
  @HostListener('window:keyup', ['$event'])
  onWindowClick(event: KeyboardEvent) {
    if (event.code == 'KeyX' && event.altKey) {
      this.deleteSingleMessage();
    }
  }

  messages: Message[] = [];
  messagesSubscription$!: Subscription;
  // Default Persist Message Types to Danger
  persistMessageTypes: MessageType[] = [MessageType.Danger]

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    // if persist message types params are passed, then use them to set Persist Message Types
    if (this.persistMessageTypesParam) {
      this.persistMessageTypes = [];
      this.persistMessageTypesParam.forEach(typeString => {
        this.persistMessageTypes.push(MessageType[typeString as keyof typeof MessageType]);
      })
    }      

    // subscribe to messages
    this.subscribeToMessages();

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.messagesSubscription$.unsubscribe();
  }

  /**
   * subscribe to Messages
   */
  subscribeToMessages(): void {
    this.messagesSubscription$ = this.messageService.getMessage().subscribe(message => {
      // if there is a message and either the subject matches or no subject is set, then push that message
      if (message && (message.subject === this.subject || this.subject === '')) {
        const msg = this.messages.findIndex(msg => msg.subject === message.subject && msg.type === message.type && msg.message === message.message);
        // do not display duplicate messages
        if (msg < 0)
          this.messages.push(message);
        // if messages are not set to persist, then set a timeout to dispose of them
        if (!this.persistMessageTypes.includes(message.type) && !message.persist)
          setTimeout(() => this.deleteMessage(message), this.disposeInterval);
      }
    });
  }

  /**
   * Delete Message
   * @param message Message
   */
  deleteMessage(message: Message): void {
    const index = this.messages.findIndex(msg => msg.messageId === message.messageId);
    if (index > -1)
      this.messages.splice(index, 1);
  }

  /**
   * Delete  Single Messages using the keyboard
   */
  deleteSingleMessage(): void {
    const index = this.messages.length - 1;
    if (this.messages.length == 1)
      this.messages = [];
    else
      this.messages.splice(index, 1);
  }
}
