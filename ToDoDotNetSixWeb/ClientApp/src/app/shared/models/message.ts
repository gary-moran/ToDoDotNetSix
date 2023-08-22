/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Models
*  Date:      02 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Message model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  02 AUG 2023 GM          Created
************************************************************************/

import { Guid } from '../utilities/guid';
import { MessageType } from './message-type.enum';

export class Message {
  constructor(subject: string, message: string, type?: MessageType, persist?: boolean) {
    this.messageId = Guid.getGuid();
    this.subject = subject;
    this.message = message;
    this.type = type ? type : MessageType.Info;
    this.persist = persist ? persist : false;
  }
  messageId: string;
  subject: string;
  message: string;
  type: MessageType;
  persist: boolean;
}
